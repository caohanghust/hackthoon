<?php
	Class WS 
	{
		public $websocket ;	// socket with webpage
		public $webaddr = "0.0.0.0";  
		public $webport = 4000;		//port to connect websocket
		public $length=1;	//the length of data to receive from phonesocket
		public $phonesocket;	// socket with iphone
		public $phoneaddr = "0.0.0.0";
		public $phoneport = 8088;	//port to connect phonesocket
		public $handshake = false;	// 判断是否握手
		public $isweblink = false;
		public $isphonelink = false;
		public function __construct()
		{
		        	// create socket with webpage(websocket)
			$this->websocket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)   
			or die("socket_create() failed");
			socket_set_option($this->websocket, SOL_SOCKET, SO_REUSEADDR, 1)  
			or die("socket_option() failed");
			socket_bind($this->websocket, $this->webaddr, $this->webport)                    
			or die("socket_bind() failed");
			socket_listen($this->websocket, 2)                               
			or die("socket_listen() failed");

			//create socket with phone
			$this->phonesocket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)
			or die("socket_create() failed");
			socket_set_option($this->phonesocket, SOL_SOCKET, SO_REUSEADDR, 1)  
			or die("socket_option() failed");
			socket_bind($this->phonesocket, $this->phoneaddr, $this->phoneport)                    
			or die("socket_bind() failed");
			socket_listen($this->phonesocket, 2)                               
			or die("socket_listen() failed");

			echo "init finished\n";
		}

		public function index()
		{
			$websocket = socket_accept($this->websocket);
		        	echo "websocket connectted\n";
		        	$this->isweblink =true;
		        	$phonesocket = socket_accept($this->phonesocket);
		        	$this->isphonelink =true;
		        	echo "phonesocket connectted\n";

		        	while(true) 
		        	{  
				if (!$this->handshake) 
				{
					if( !$this->isweblink)
					{
						$websocket = socket_accept($this->websocket);
		        				echo "websocket refreshed\n";
		        				$this->isweblink =true;
					}
			           		$bytes = @socket_recv($websocket,$buffer,2048,0);
					if($bytes == 0) 
						continue;
					// 如果没有握手，先握手回应
					$this->dohandshake($websocket, $buffer);
					echo "shakeHands :success\n";
					echo "start to receive data from phonesocket\n";
				}	 
				else 
				{
					if($this->isweblink && $this->isphonelink)
					{
						// get operation data from phone and push to the webpage	
						//$buffer = $this->uncode($buffer);
						$operation = socket_recv($phonesocket,$buffer,$this->length,MSG_WAITALL);
						if($operation <  $this->length)
						{
							socket_close($phonesocket);
							echo "phonesocket closed!\n";
							exit();
						}
						$data['operation'] = $buffer;
						echo "resceive num:$buffer\n";
						$json = json_encode($data,true);
						$result = $this->send($websocket,$json);
						$status = $result ? "success" :"failed";
						echo "write to webpage status:".$status."\n";
						if($buffer == 7)
						{	
							socket_close($websocket);
							$this->isweblink = false;
							$this->handshake =false;
						}
					}

				}
			}
		}

		private function getKey($req) 
		{
			$key = null;
		    	if (preg_match("/Sec-WebSocket-Key: (.*)\r\n/", $req, $match)) 
		    	{ 
		        		$key = $match[1]; 
		    	}
		    	return $key;
		}
		// 加密 Sec-WebSocket-Key
		private function encry($req)
		{
			$key = $this->getKey($req);
		    	$mask = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
		    	return base64_encode(sha1($key . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', true));
		}

		private function dohandshake($socket, $req)
		{
			// 获取加密key
		    	$acceptKey = $this->encry($req);
		    	$upgrade = "HTTP/1.1 101 Switching Protocols\r\n" .
		            	"Upgrade: websocket\r\n" .
		            	"Connection: Upgrade\r\n" .
		           	"Sec-WebSocket-Accept: " . $acceptKey . "\r\n" .
		            	"\r\n";
		    	// 写入socket
		    	socket_write($socket,$upgrade, strlen($upgrade));
		    	// 标记握手已经成功，下次接受数据采用数据帧格式
		    	$this->handshake = true;
		}

		// 返回数据
		private function send($client, $msg)
		{
			$msg = $this->code($msg);
		    	$result = socket_write($client, $msg, strlen($msg));
		    	return $result;
		}
		//
		private function uncode($str)
		{
			$mask = array();  
			$data = '';  
			$msg = unpack('H*',$str);  
			$head = substr($msg[1],0,2);  
			if (hexdec($head{1}) === 8) 
			{  
				$data = false;  
			}
			else if (hexdec($head{1}) === 1)
			{  
				$mask[] = hexdec(substr($msg[1],4,2));
				$mask[] = hexdec(substr($msg[1],6,2));
				$mask[] = hexdec(substr($msg[1],8,2));
				$mask[] = hexdec(substr($msg[1],10,2));
				$s = 12;  
				$e = strlen($msg[1])-2;  
				$n = 0;  
				for ($i=$s; $i<= $e; $i+= 2) 
				{  
					$data .= chr($mask[$n%4]^hexdec(substr($msg[1],$i,2)));  
					$n++;  
				}  
			}  

			return $data;
		}

		private function code($msg)
		{
			$msg = preg_replace(array('/\r$/','/\n$/','/\r\n$/',), '', $msg);
			$frame = array();  
	      		$frame[0] = '81';  
	      		$len = strlen($msg);  
		      	$frame[1] = $len<16?'0'.dechex($len):dechex($len);
	      		$frame[2] = $this->ord_hex($msg);
			$data = implode('',$frame);
	      		return pack("H*", $data);
	    	}

	   	private function ord_hex($data)  
	   	{  
	      		$msg = '';  
	      		$l = strlen($data);  
	      		for ($i= 0; $i<$l; $i++) 
	      		{  
	        			$msg .= dechex(ord($data{$i}));  
	      		}  
	      		return $msg;  
	    	}

	}
?>