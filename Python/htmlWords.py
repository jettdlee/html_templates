#!/usr/bin/python3

# HTML Header and Footer
# Created by Jet-Tsyn Lee 29/11/17 
# Last updated 29/11/2017 v0.1

# Funtions to print out HTML header and footers
# Stored in ~m7jtl/public_html/cgi-bin/

# Header Function
def start_html():
    print('Content-type:text/html')
    print('''
<!DOCTYPE html>
<html>

	<head>
		<meta charset = 'utf-8'>
		<title>Word Counter</title>
		<meta name='Title' content='Word Counter' />
		<meta name='Type' content='Word Counter' />
		<meta name='Rights' content='Copyright Jet-Tsyn Lee' />
		<meta name ="Author" content ="Jet-Tsyn Lee">
		<meta name ="Description" content ="Word Counter, counts the number of words in a URL address or submitted text">
		<meta name ="Keywords" content ="Word, Count, URL">		
		
		<style>
			html {
				font-family:'Arial';
				background-color:#d6d6d6;
				text-align:center;
			}
			
			h2 {
				text-align:center;
				font-size:120%;
				color:#0038aa;
			}
			
			header{	
				padding: 20px 40px;
				font-size:200%;
				font-weight:bold;
				text-align:center;
				color:#ffffff;
			}
			
			li{
				padding:3px 0px;
			}
			
			footer {
				color:#ffffff;
				margin-top:50px;
				padding: 10px 20px 20px; 
				font-size:80%; 
			}

			header, footer, #btnSubmit{
				background-color:#0038aa;
			}
			
			#description{
				text-align:left;
				width:50%;
			}
			
			#userForm{
				width:50%;
				float:right;
				vertical-align:center;
				padding:20px;
				text-align:center;
			}
			
			#form_input{
				width:95%;
				display:inline-flex;
			}
			
			#inputError{
				color:red;
				font-weight:bold;
			}
			
			#inputURL{
				width:50%
			}
			
			#btnSubmit{
				color: white;
				padding: 10px 25px;
				border: none;
				border-radius: 10px;
				cursor: pointer;
				font-size:20px;
				text-align:center;
				margin:20px 40px 20px 40px;
			}
			
			table, td, th{
				border-collapse: collapse;
				border-style:solid; 
				border-color:#4f4f4f;
				text-align:center;
				font-size:100%
			}
			table{
				display: inline-table;
				table-layout: fixed;
				word-wrap:break-word
			}
			td {	
				background-color:white;
				max-width:40px
			}
			th {
				padding:5px 10px
			}

			#count{
				width:95%
				text-align:center;
			}
			
			.wordRank{
				width:35%;
				display:inline-block;
				vertical-align:top;
			}
			
			.submittedText{
				width:60%;
				display:inline-block;
				vertical-align:top;
			}

			#scriptInp{
				background-color:#ffffff;
				display: inline-block;
				width:97%;
				word-wrap:break-word;
				padding: 2px 2px;
			}
		
		</style>
		
	</head>

	<header>Word Counter</header>
	
	<body>
    ''')

# Footer Function
def end_html():
    print('''
				<footer>
					<span style="float:left; vertical-align:middle">Copyright &copy; Jet-Tsyn Lee</span>
					<span style="float:right">
						Last modified:
						<script type="text/javascript">
							document.writeln(document.lastModified);
						</script>
					</span>
				</footer>
			
			</body>
		</html>
		''')