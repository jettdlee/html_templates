#!/usr/bin/python3

# Word Checker Website
# Created by Jet-Tsyn Lee 20/11/17 
# Last updated 29/11/2017 v0.2

# Website allows user to input url address or text input and checks the number of words
# using a python script. Words are declared depending on a number of factors, explained
# in the script below. Counts will be presented showing the total, top 10 and bottom 10 words.


import urllib.request, re, os, cgi, cgitb
# Import HTML code for header and footer, Stored in ~m7jtl/public_html/cgi-bin/
from htmlWords import start_html, end_html	


# #######  WEBPAGE  #######
# Setup HTML page containing Form to allow user inputs for URL and text
# and checks for user inputs to confirm count.

# HTML Header, from htmlWords.py
start_html()

inputs = cgi.FieldStorage()
cgitb.enable()
# Enables and Disables the script to run, 
# e.g. if an error occurs, disable script and print remaining HTML
runScript = True	

# Determines what fields the user entered
isURL = False
isText = False

# Checks if the initial state of the webpage, if loaded show form and disable script, to allow user to input fields
if os.environ['QUERY_STRING'] == "":
	runScript = False

# Retreive inputs from userform 
# URL ADDRESS
if runScript == True and inputs.getvalue('urlInput') is not None:
	# Due to issues with unicode characters e.g. '£', input is encoded and decoded, replacing characters with ? to ensure no error
	urlInput = str(inputs.getvalue('urlInput').encode('ascii', 'replace').decode('ascii'))
	isURL = True
else:
	urlInput = ""

# TEXT
if runScript == True and inputs.getvalue('textInput') is not None: 
	# Same as URL, ? characters will be classed as delimiteer and replaced in the process
	textInput = inputs.getvalue('textInput').encode('ascii', 'replace').decode('ascii')
	isText = True
else:
	textInput = ""
	
# Print Webpage description and userform
print('''<div id='form_input'>''')
print('''
	<div id='description'>
		<p>This simple tool will determine the amount of words in a URL address or a given chunk of text. <br> The conditions of the word count are:</p>
		<ul class="navbar">
			<li>A word consists of ASCII <i>letters</i>, <i>digits</i>, ', - and _</li>
			<li>Start with a <i>letter</i>, or ' followed by <i>letter</i></li>
			<li>End with <i>letter</i>, <i>digit</i>, or ' preceded by <i>s</i></li>
			<li>Delimiters are not counted in a word and is converted to <i>space</i></li>
			<li>Any other character considered to be delimiter</li>
			<li>HTML Tags and comments are not counted <i>(if inputted URL link)</i></li>
			<li>Words linked with <i>one</i> '-' counted as a single word</li>
			<li>Words linked with <i>two or more</i> '-' (em-dashes) are seperate words</li>
			<li><i>Contractions</i> and <i>possessive</i> words are counted seperatly</li>
			<li>Words are <i>NOT</i> case sensitive</li>
			<li>Unknown Unicode characters will be converted to ?</li>
		</ul>
	</div>''')
	
# Text area set to 5700 max characters, as inputs ~> 5700 characters causes webpage errors.
print('''<form id='userForm' action="" method='get'>
		<label for='inputURL'>Enter full URL address (inc. https://):</label>
		<input name='urlInput' id='inputURL' type='text' value="''' + urlInput + '''">
		
		<p>or Enter text directly to the field below (Max. 5700 Characters):</p>
		<textarea rows="10" cols="70" name="textInput" form='userForm' maxlength='5700' >''' + textInput + '''</textarea>
		<br>
		<input id='btnSubmit' type='submit' value='Submit'>
	''')

# Check the users input to ensure that the fields are correct and access URL address (if input requires)
print('''<div id='inputError'>''')
if runScript == True:
  
	# If both inputs are completed, show error
	if isURL == True and isText == True:
		print('''URL and text input found. Please input to only one field.''')
		runScript = False
	
	# If no inputs are completed, show error
	elif isURL == False and isText == False:
		print('''No inputs found, Please input to only one field.''')
		runScript = False
	
	# retreive URL source code from address
	elif isURL == True:
		
		# Access the URL address, return error if address invalid using exception statement
		try:
			# Request URL and cost Source code
			urlResp = urllib.request.urlopen(urlInput)
			sourceInput = urlResp.read()
			
			# Copy source code before decoding to be printed in statement
			docProcess = str(sourceInput)	
			urlResp.close()
			
			# Decode Source code to UTF 8 to convert byte to str
			sourceInput = sourceInput.decode("utf8")

		except:
			# If unable to access address, return error
			print('''Unable to access URL, please check address and try again.''')
			runScript = False
	
	# Retreive the users text input and store in variables
	elif isText == True:
		sourceInput = str(textInput)
		docProcess = str(textInput)
		
print('''</div></form></div>''')


# #######  FINDING WORDS  #######
# The process requires removing all non essential characters in the string that are not required and 
# replaces with space to distinguish individual words for the list. This is then checked to ensure
# that the word is valid to be counted.

if runScript == True:


	# ~~~~~  Functions  ~~~~~
	# Functions are set up to be fed the source string and remove any contents not required, and replace with spaces
	# this allows the split to determine the individual words
	
	# Fuction to sweep the string and replaced as required
	def cleanString(string):
		# Replace double quotation `` (grave accent) or '' (apostrophe) to a single " to ensure quote marking is correct
		# 3 quotes (''') will convert to a single apostrophe
		string = re.sub(r"(\'|\`){2}", '"', string) 

		# Remove any other character or delimiters not considered ASCII and replace with space
		# Excluding ', -, `, ", letters and digits
		string = re.sub(r'[^\w|\"|\'|\-|\`]+', ' ', string)
		
		# Find em dashes (--) if contains more than 1 '-' and repace with space
		string = re.sub(r'-{2,}', ' ', string) 
		return string	
	
	# Remove any HTML comments and tags (for URL only)
	def clearHTML(string):
	
		# Identify all quotes in page, and remove < > symbol within quotes the quotes as this may be classed as valid words
		# e.g. <p>"this is <not> html"</p>
		for s in re.findall(r'(\'|\").*?(\1)',string):
			# Search if quotes contains < >
			if '<' in s or '>' in s:
				# remove <> be replacing with space and store in variable
				removed = re.sub(r'<|>',' ',s)     				
				# replace in source source code with removed variable
				string = string.replace(s, removed)	
		
		# Replaces string literal \< or \> with spaces to to ensure this is not removed in the HTML tags
		# e.g. <p>html is closed using \</html\></p>
		string = re.sub(r'\\<|\\>', ' ', string)
		
		# Remove all HTML tags and comments by identifying contents enclosed by angular brackets < >
		string = re.sub(r'<(.*?)>', ' ', string)		
		
		return string
	
	
	# ~~~~~ REMOVE AND REPLACE CONTENTS ~~~~~	
	# Sets all characters to lower case to remove case sensitivity for words
	sourceInput = str(sourceInput).lower()
	
	# Remove excess spaces and any new line/return etc. which may affect the following REGEX
	sourceInput = re.sub(r'\s+',' ',sourceInput)     

	# Remove HTML Tags using function above
	# for URL import only, as manual text input by user my count as valid text to be remaining
	# e.g. Count if this is < a word >
	if isURL == True:
		sourceInput = clearHTML(sourceInput)
	
	# Clear exception characters using funciton
	sourceInput = cleanString(sourceInput)
	
	# Split words by space to create list
	wordArr = sourceInput.split()
  
  
	# ~~~~~  CHECK WORDS ~~~~~
	# Loop through each word in the created list and check if it is a valid word to be counted depending on the criterias
	
	# Function checks the specified word against the criterias and validate
	# Will return the word with alterations if required, returns false if invalid
	def wordCheck(wordString):
		
		# Remove quote characters in string (only start and end) if both ends has the same quote
		# i.e. 'one' = one = word, one' = not word
		if re.search(r'^(\'|\"|\`).*?(\1)$',wordString):
			# Find quote char in start position and remove
			wordString = re.sub(r'^(\'|\"|\`)','',wordString)
			# Find quote char in end position and remove
			wordString = re.sub(r'(\'|\"|\`)$','',wordString)
		
		# There are 3 checks to perform to ensure that the word is valid and requires the set variables to be true
				
		# START CHARACTER
		# Checks char starts with letter OR apostrophe followed by letter
		start = False		
		if re.search(r'(^[a-z])|(^\'[a-z])',wordString):
			start = True
		 
		# INTERNAL CONTENTS
		contents = True		
		# Identifies if word contains any invalid char/symbol not counted in word
		if re.search(r'[^\w|\'|\"|\-|\_]',wordString):
			contents = False
		
		#END CHARACTER
		# Check end char is either a letter/digit OR 's, cant use \w as this contains _
		end = False
		if re.search(r'[a-z0-9]$|s\'$',wordString):
			end = True
		
		# All checks must be true to validate word and return string
		# else return false and not counted
		if start == True and contents == True and end == True:
			return str(wordString)
		else:
			return False
  
  
	# ------------------------------------------------------------
	# Word will be validated and added to a new list to be counted using the function
	wordCount = []
	for i in wordArr:
		checkWord = wordCheck(str(i))
		if checkWord != False:
			wordCount.append(checkWord)

	
	# #######  COUNTING WORDS  #######
	
	# Sum words by adding each word to a dictionary and adding count, with the word as key
	wordDict = {}
	for word in wordCount:
		if word in wordDict:
			wordDict[word] += 1
		else:
			wordDict[word] = 1
  
	# Convert dictionary to list and sort by count, lowest to highest, then alphabetically
	sortWords = sorted(wordDict.items(), key=lambda x:(x[1], x[0]))

	
	# RANK WORD OCCURANCES~~~~~~~~~~~~~~~~~~~~~~~~~~
	# Create individual lists containing the top and bottom 10 words
	totalWords = len(wordCount)
 
	# Minimum amount of words to rank/or length of array, add 1 due to zero array
	rank = 10
	minWord = min(rank, len(sortWords)) + 1

	# Most occurances, starting from the end and decrease by 1
	mostArr = []
	for i in range(-1,-(minWord),-1):
		mostArr.append(sortWords[i])
	
	# Least occurances, starting at the beginning and increase by one
	leastArr = []
	for i in range(0,minWord-1,1):
		leastArr.append(sortWords[i])
	

	# #######  SHOW RESULTS #######
	# Print results of text to user in HTML page
	print('''<article id='count'>''')
	
	# ~~~  Total Word Count  ~~~
	print('''<h3 class='wordCount'>This ''')
	if isURL == True:
		print('URL address')
	elif isText == True:
		print('document')
	print(''' contains''',str(totalWords))
	if len(wordCount) == 1:
		print(''' word.''')
	else:
		print(''' words.''')
	print('''</h3>''')

	# ~~~  Word Occurances table  ~~~
	print('''<section class="wordRank">''')
	print('''<h2>Word Occurances</h2>''')
	print('''<table id="countTbl"><thead>''')
	print('''<tr><th colspan='2'>10 Words Occurring Most Often</th><th colspan='2'>10 Words Occurring Least Often</th></tr>
			<tr><th>Word</th><th>No. of occurances</th><th>Word</th><th>No. of occurances</th></tr>''')
	print('''</thead><tbody>''')
	
	# For each rank, create a new table row so show the most/least word occurances
	for i in range (0, minWord-1, 1):
		print('''<tr>''')
		print('''<td>''' + str(mostArr[i][0]) + '''</td>''')	# Most - Word
		print('''<td>''' + str(mostArr[i][1]) + '''</td>''')	# Most - Count
		print('''<td>''' + str(leastArr[i][0]) + '''</td>''')	# Least - Word
		print('''<td>''' + str(leastArr[i][1]) + '''</td>''')	# Least - Count
		print('''</tr>''')
		
	print('''</></table></section>''')
	
	
	# ~~~  Source Code print  ~~~
	print('''<section class='submittedText'>''')
	print('''<h2>Input</h2>''')
	print('''<div id='scriptInp'>''')
	
	# Shows URL address if user completed field
	if isURL == True:
		print('''<p><b>URL address:</b>''' + urlInput + '''</p>''')
	
	# Converts copy statment to HTML safe text
	docProcess = cgi.escape(docProcess, quote=True)
	print('''<code>''' + docProcess + '''</code>''')
	print('''</div></section></article>''')


# HTML Footer, from htmlWords.py
end_html()
