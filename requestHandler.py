import requests
import json

import datetime
import calendar

urlHost = "http://localhost:5000/calendar"
urlBookings = urlHost
urlRooms = urlHost+"/rooms"

contentJSON = {"content-type" : "application/json"}

def makeTimestamp(hours, days=0):
	past = datetime.datetime.utcnow() - datetime.timedelta(hours = hours, days=days)
	return calendar.timegm(past.timetuple())*1000
	
#--Rooms--
def roomCreate(name):
	payload = {"name": name}
	return requests.post(urlRooms, json.dumps(payload), headers=contentJSON)

def roomListAll():
	return requests.get(urlRooms)

#--Bookings--
def bookingCreate(title, start, end, resources, allDay="false", client=""):
	payload = {"title": title, "start": start, "end": end, "allDay": str(allDay), "_resources": resources, "client": client}
	return requests.post(urlBookings, json.dumps(payload), headers=contentJSON)

def bookingListAll():
	return requests.get(urlBookings+"/getEvents")


#-------GUI----------
def createRoomGUI():
	roomName = raw_input("Room Name: ")
	roomCreate(roomName)

def printRoomsGUI():
	print roomListAll().content

def selectRoomGUI():
	allRooms = json.loads(roomListAll().content)
	for i in range(len(allRooms)):
		room = allRooms[i]
		if (room.__contains__("name")):
			print str(i)+". " + room["name"]
	
	selection = int(raw_input())
	return allRooms[selection]["_id"]

def printRoomGUI():
	print roomListAll().content

def createBookingGUI():
	title = raw_input("Title: ")
	start = makeTimestamp(int(raw_input("Start (hours ago): ")))
	end = makeTimestamp(int(raw_input("End (hours ago): ")))
	room = selectRoomGUI();
	return bookingCreate(title, start, end, [room], "false", "bob")

def printBookingsGUI():
	print bookingListAll().content

def GUI():
	print("1. Rooms")
	print("2. Bookings")
	print("3. Exit")
	selection = int(raw_input(">"))-1
	if (selection <2):
		while([roomGUI, bookingGUI][selection]() != 2): pass
	return selection

def roomGUI():
	print("1. List Rooms")
	print("2. Create Room")
	print("2. Update Room")
	print("2. Delete Room")
	print("3. Back")
	selection = int(raw_input(">"))-1
	if (selection <2):
		[printRoomsGUI, createRoomGUI][selection]()
	return selection

def bookingGUI():
	print("1. List Bookings")
	print("2. Create Booking")
	print("3. Back")
	selection = int(raw_input(">"))-1
	if (selection <2):
		[printBookingsGUI, createBookingGUI][selection]()
	return selection

while (GUI() != 2): pass

#print createBookingGUI().content
#print roomListAll().content

#print bookingCreate("All day booking", makeTimestamp(3), makeTimestamp(1),  "osjdfisdjf", allDay="true", client="Rob Spangles").content

#print bookingCreate("Time specific booking", makeTimestamp(3), makeTimestamp(1),  "54ac2c9c9ed769e7198f7bd8", client="Bob Jangles").content
#roomCreate("resource4", "Crimson Room")
	


#curl -X POST -H "Content-Type: application/json" -d '{"id" : "resource1", "name" : "Blue Room"}' localhost:5000/calendar/rooms
#curl -X POST -H "Content-Type: application/json" -d '{"id" : "resource2", "name" : "Red Room"}' localhost:5000/calendar/rooms
#curl -X POST -H "Content-Type: application/json" -d '{"id" : "resource3", "name" : "Green Room"}' localhost:5000/calendar/rooms

#curl -X POST -H "Content-Type: application/json" -d '{"title" : "Hello", "start" : "1420211635820", "end" : "1420211638820", "allDay" : "true", "_resources" : "54ac2c9c9ed769e7198f7bd8", "client" : "" }' localhost:5000/calendar 
