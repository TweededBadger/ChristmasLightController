import math

import serial
import time
from threading import Thread, Lock
class Serial:
  def __init__(self, port='COM6', rate=9600, timeout=10):
      self._serial = serial.Serial(port, rate, timeout=timeout)
      self._mutex = Lock()
      self._mutex.acquire()
      response = self._serial.readline().strip()
      print response
      if response != 'OK':
          raise Exception("Failed to communicate with the serial device!")
      self._mutex.release()

  def _shortCommand(self, command):
      self._serial.write(command)
      response = self._serial.readline()
      return response.strip()

  def _longCommand(self, command):
      response = self._shortCommand('RCV ' + str(len(command)) + "\n")
      if response != 'RDY':
          return None
      for i in range(int(math.ceil(len(command) / 128.0))):
          c = command[128*i:128*(i+1)]
          response = self._shortCommand(c)
      return self._serial.readline().strip()

  def command(self, command):
      self._mutex.acquire()
      if len(command) < 128:
          response = self._shortCommand(command + "\n")
      else:
          response = self._longCommand(command)
      self._mutex.release()
      return response

import random, string
def main():
  serial = Serial(port='COM6', rate=115200)
  passed = 0
  failed = 0
  for i in range(1000):
      l = random.randint(1, 1023)
      s = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for x in range(l))
      o = serial.command(s)
      if o == s:
          print (i + 1), 'OK', l, 'bytes'
          passed = passed + 1
      else:
          print (i + 1), 'FAIL', l, 'bytes'
          failed = failed + 1
  print 'Passed:', passed
  print 'Failed:', failed

colors = []

serial = Serial(port='COM6', rate=115200)

def sendColorArray():

    time.sleep(1)
    sendstrings = [];
    currentString = ""
    for colour in colors:
        s = ""
        s = s + "i" + str(colour['i'])
        s = s + "r" + str(colour['r'])
        s = s + "g" + str(colour['g'])
        s = s + "b" + str(colour['b'])

        if (len(currentString+s) > 1023):
            sendstrings.append(currentString)
            currentString = s
        else:
            currentString = currentString + s

    sendstrings.append(currentString)


    for string in sendstrings:
        sent = False
        while(not sent):
            print "OUT"
            print string
            print len(string)
            o = serial.command(string)
            if o:
                print "IN"
                print o
                print len(o)
                if string == o:
                    print "CORRECT"
                    sent = True
                time.sleep(.1)



def createColorArray():
    for k in range(1, 241):
        colour = {}
        colour['i'] = k
        colour['r'] = int(((math.sin(k/10.0)+1.0)/2.0)*255.0)
        colour['g'] = int(((math.cos(k/10.0)+1.0)/2.0)*255.0)
        colour['b'] = int(((math.cos((k+50)/5.0)+1.0)/2.0)*255.0)
        colors.append(colour);
def test():

    createColorArray()
    sendColorArray()
    while True:
        pass

    # for k in range(1, 240):
    #     # print k
    #
    #
    #     r = int(((math.sin(k/10.0)+1.0)/2.0)*255.0)
    #     g = int(((math.cos(k/10.0)+1.0)/2.0)*255.0)
    #
    #     s = ''
    #     s = s + "i" + str(k)
    #     # s= s + "r" + str(random.randint(0, 254))
    #     # s= s + "g" + str(random.randint(0, 254))
    #     # s= s + "b" + str(random.randint(0, 254))
    #     s= s + "r" + str(r)
    #     s= s + "g" + str(g)
    #     s= s + "b" + str(0)
    #
    #     sent = False
    #     while(not sent):
    #         print s
    #         o = serial.command(s)
    #         print o
    #         if (s == o):
    #             sent = True
    #         time.sleep(.1)
    #
    #
    # for k in range(0, 10):
    #     print k
    #     # s = ''
    #     # s = s + "i" + str(k)
    #     # s= s + "r" + str(random.randint(0, 254))
    #     # s= s + "g" + str(random.randint(0, 254))
    #     # s= s + "b" + str(random.randint(0, 254))
    #     # # s= s + ","
    #     # # s = "i1r254g0b0i2r0g254b0i3r0g0b254"
    #     # # s = "i2r254g0b0i"
    #     # print s
    #     # o = serial.command(s)
    #     # print o
    #
    # # for j in range(0,10):
    #
    #     # time.sleep(.1)


if __name__ == '__main__':
  # main()
    test()