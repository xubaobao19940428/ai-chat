1、根据选中的模型或者没有选中用默认的模型
2、判断 model_input 里面的 capability 显示不同的输入Form表单，每次切换模型重置为新的表单。
	目前就 3 套 Form 表单，后面加其他的，每套都独立，尽量别混用，到时候会很乱。
	
	https://www.aichatlab.net/chat
	https://www.aichatlab.net/video-generation
	https://www.aichatlab.net/image-generation
	https://www.aichatlab.net/character/903
	
	相当于上面4个页面的表单输入区域是统一一套代码，后面再细分的话，Form表单也是一样的，统一一套代码。
	
	
	-----------------------------
	

	 - capability = chat 聊天
		显示或者重置为 聊天 表单，全部表单包含：
				· 左边：模型选择、添加文件按钮（和图片一样，需要支持本地上传或者库选择）、联网按钮、技能按钮、设置按钮
				· 右边：语音输入、发送
		再根据 model_input 里面的 fields（key=>value结构） ，提取全部 key ，判断上面的按钮是否显示。比如包含了enable_web_search，就显示联网按钮。没有就不显示。其他的同理。


	- capability = image_generation 图片生成
			显示或者重置为 图片生成 表单，全部表单包含：
				· 左边：模型选择、参考图（单张 image）、参考图（多张 input_images）、宽高比（aspect_ratio）、分辨率（resolution）、输出张数（num_outputs）
				· 右边：语音输入、发送
		再根据 model_input 里面的 fields（key=>value结构） ，提取全部 key ，判断上面的按钮是否显示。比如包含了image，就显示参考图按钮。没有就不显示hidden掉。其他的同理。


	- capability = video_generation 视频生成
		显示或者重置为 视频生成 表单，全部表单包含：
				· 左边：模型选择、参考图（单张 image）、参考图（多张 input_images）、首帧(start_image)、尾帧（end_image）、参考视频（video）、参考视频（多个 input_videos）、宽高比（aspect_ratio）、分辨率（resolution）、时长（duration）、是否生成音频（audio_enabled）、输出个数（num_outputs）【注意：参考图和首尾帧等都可能同时出现】
				· 右边：语音输入、发送
		再根据 model_input 里面的 fields（key=>value结构） ，提取全部 key ，判断上面的按钮是否显示。比如包含了image，就显示参考图按钮。没有就不显示hidden掉。其他的同理。
		
		
		
	--------------------- 目前支持上面的，后续加入下面的 ------------------
	
	- capability = speech_to_text 语音转文本
	显示或者重置为 语音转文本 表单，全部表单包含：
				· 左边：模型选择、音频链接（audio_url 支持库选择、上传、语音输入）
				· 右边：发送

	- capability = text_to_speech 文本转语音
	- capability = lipsync 视频唇形同步
	- capability = motion_control 视频运动转移
	- capability = image_upscale  超分辨率
	- capability = image_remove-bg  去背景
	- capability = image_inpaint 局部重绘
	- capability = image_outpaint  图像扩展
	- capability = image_style-transfer 风格迁移
	- capability = image_variation 图像变体
	- capability = image_edit 图像编辑

	--------------------- Agent ------------------
	- capability = agent 
						一句话解决问题，全自动调用上面接口处理
						
						
	--------
	chat 样例：
	{"capability":"chat","fields":{"messages":{"type":"chat_messages","required":true,"roles":["system","user","assistant","tool"],"maxItems":50},"temperature":{"type":"number","default":0.7,"min":0,"max":2,"step":0.1},"top_p":{"type":"number","default":0.9,"min":0,"max":1,"step":0.01},"top_k":{"type":"number","default":0,"min":0,"max":100,"step":1},"max_tokens":{"type":"number","default":2048,"min":1,"max":128000,"step":1},"stream":{"type":"boolean","default":false},"stop":{"type":"array","item_type":"string","nullable":true,"maxItems":4,"maxLength":64},"presence_penalty":{"type":"number","default":0,"min":-2,"max":2,"step":0.1},"frequency_penalty":{"type":"number","default":0,"min":-2,"max":2,"step":0.1},"image_urls":{"type":"array","item_type":"string","default":[],"maxItems":10},"file_ids":{"type":"array","item_type":"string","default":[],"maxItems":10},"enable_web_search":{"type":"boolean","default":false},"web_search_query":{"type":"string","nullable":true,"maxLength":1024},"web_search_depth":{"type":"number","default":3,"min":1,"max":20,"step":1}}}	
	
	image_generation 样例：
	{"capability":"image_generation","fields":{"prompt":{"type":"textarea","required":true,"placeholder":"A text description of the image you want to generate","maxLength":4000},"aspect_ratio":{"type":"select","default":"original","options":["original","1:1","1:4","1:8","2:3","3:2","3:4","4:1","4:3","4:5","5:4","8:1","9:16","16:9","21:9"]},"resolution":{"type":"select","default":"1K","options":["1K","2K","4K"],"description":"Resolution of the generated image. Higher resolutions take longer to generate."},"input_images":{"type":"array","items":{"type":"string","format":"uri"},"minItems":1,"maxItems":14,"nullable":true,"description":"输入图片用于转换或作为参考（最多支持14张图片）"}}}				

	video_generation 样例：
	{"capability":"video_generation","fields":{"prompt":{"type":"textarea","required":true,"placeholder":"Describe the video you want","maxLength":2000},"duration":{"type":"number","default":5,"min":2,"max":12,"description":"Video duration in seconds"},"aspect_ratio":{"type":"select","default":"16:9","options":["16:9","4:3","1:1","3:4","9:16","21:9","9:21"],"description":"Video aspect ratio"},"resolution":{"type":"select","default":"720p","options":["480p","720p","1080p"],"description":"Target video resolution"},"image":{"type":"string","format":"uri","nullable":true,"description":"Initial image URL for image-to-video"},"end_image":{"type":"string","format":"uri","nullable":true,"description":"Last frame image URL (requires start image)"},"audio_enabled":{"type":"boolean","default":true,"description":"Generate synchronized audio"}}}						