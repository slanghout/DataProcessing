# Sylvie Langhout
# 10792368
# 
# Program to make a JSON file from a CSV file
# Usage: enter the fieldnames in this file
# run by typing : python convertCSV2JSON.py filename.cvs

import csv
import json
import sys

# ensure proper usage
if len(sys.argv) < 2:
	print("please give the following input: convertCSV2JSON.py filename.csv")
	exit(0)

else:
	# last argument given is the csv file
	csvfilename = sys.argv[1]
	jsonfilename = csvfilename.split('.')[0] + '.json'

	# open the input and output files
	csvfile = open(csvfilename, 'r')
	jsonfile = open(jsonfilename, 'w')

	# set fieldnames
	fieldnames = ("address", "city", "country", "name", "postalCode", "province")
	data = csv.DictReader(csvfile, fieldnames)

	# write the data in the json file
	out = json.dumps( [ row for row in data ] )
	jsonfile.write(out)
	# close the files
	csvfile.close()
	jsonfile.close()