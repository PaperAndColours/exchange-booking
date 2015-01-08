import requests
import json

import datetime
import calendar

urlHost = "http://localhost:5000/calendar"
urlBookings = urlHost+"/booking"
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
	return requests.get(urlBookings)


#-------GUI----------
#--Room gui-----
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

def updateRoomGUI():
	pass

def deleteRoomGUI():
	pass

def printRoomGUI():
	print roomListAll().content

#--Booking gui-----
def createBookingGUI():
	title = raw_input("Title: ")
	start = makeTimestamp(int(raw_input("Start (hours ago): ")))
	end = makeTimestamp(int(raw_input("End (hours ago): ")))
	room = selectRoomGUI();
	return bookingCreate(title, start, end, [room], "false", "bob")

def printBookingsGUI():
	print bookingListAll().content

def updateBookingGUI():
	pass

def deleteBookingGUI():
	pass

#--main gui
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
	print("3. Update Room")
	print("4. Delete Room")
	print("5. Back")
	selection = int(raw_input(">"))-1
	if (selection <4):
		[printRoomsGUI, createRoomGUI, updateRoomGUI, deleteRoomGUI][selection]()
	return selection

def bookingGUI():
	print("1. List Bookings")
	print("2. Create Booking")
	print("3. Update Booking")
	print("4. Delete Booking")
	print("5. Back")
	selection = int(raw_input(">"))-1
	if (selection <4):
		[printBookingsGUI, createBookingGUI, updateBookingGUI, deleteBookingGUI][selection]()
	return selection

while (GUI() != 2): pass

#--------------Individual tests----


#payload = {"title": "Scooby", "start": makeTimestamp(10), "end": makeTimestamp(1), "allDay": "false", "_resources": "54ae9486592438460370bef4", "client": "doggy bog"}
#payload = {"title": "Scooby", "start": makeTimestamp(10), "end": makeTimestamp(1), "allDay": "false",  "client": "doggy bog"}
print requests.post(urlBookings, json.dumps(payload), headers=contentJSON).content
