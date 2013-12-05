import math

import serial
import time
import MySQLdb

from threading import Thread, Lock
class Serial:
  def __init__(self, port='COM5', rate=9600, timeout=10):
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
  serial = Serial(port='COM5', rate=115200)
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

serial = Serial(port='COM5', rate=115200)

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

def sendString(str):
    sent = False
    while(not sent):
        print "OUT"
        print str
        print len(str)
        o = serial.command(str)
        if o:
            print "IN"
            print o
            print len(o)
            if str == o:
                print "CORRECT"
                sent = True
            time.sleep(2)


def createColorArray():
    for k in range(1, 241):
        colour = {}
        colour['i'] = k
        colour['r'] = int(((math.sin(k/10.0)+1.0)/2.0)*255.0)
        colour['g'] = int(((math.cos(k/10.0)+1.0)/2.0)*255.0)
        colour['b'] = int(((math.cos((k+50)/5.0)+1.0)/2.0)*255.0)
        colors.append(colour);

def createBlankColorArray():
    for k in range(1, 241):
        colour = {}
        colour['i'] = k
        colour['r'] = 0
        colour['g'] = 0
        colour['b'] = 0
        colors.append(colour);

def sendBigString(lightstring):
    index1 = lightstring.index("i",950)
    index2 = lightstring.index("i",index1+950)
    sendString(lightstring[0:index1])
    sendString(lightstring[index1:index2])

    try:
        index3 = lightstring.index("i",index2+950)
    except:
        index3 = 999999


    sendString(lightstring[index2:index3])

    if index3 != 999999:
        sendString(lightstring[index3:999999])
def test():

    # createColorArray()
    # sendColorArray()
    # while True:
    #     pass
    # i0r255g49b35i1r255g49b35i2r255g49b35i3r255g49b35i4r255g49b35i5r255g49b35i6r252g52b35i7r249g56b35i8r242g62b34i9r240g66b35i10r236g69b34i11r233g73b35i12r230g76b34i13r227g80b35i14r224g82b34i15r221g86b35i16r217g89b34i17r215g93b35i18r211g96b34i19r209g100b35i20r205g103b34i21r202g107b35i22r199g109b34i23r193g117b34i24r190g120b34i25r187g123b34i26r183g126b34i27r181g130b34i28r177g133b34i29r175g137b34i30r171g140b34i31r168g144b34i32r165g147b34i33r162g150b34i34r159g153b34i35r156g157b34i36r152g160b34i37r150g164b34i38r143g170b33i39r140g174b34i40r137g177b33i41r134g181b34i42r131g184b33i43r128g188b34i44r124g190b33i45r122g194b34i46r118g197b33i47r116g201b34i48r112g204b33i49r110g208b34i50r106g211b33i51r103g215b34i52r100g217b33i53r94g225b33i54r90g228b33i55r88g231b33i56r84g234b33i57r82g238b33i58r78g241b33i59r75g245b33i60r72g248b33i61r69g252b33i62r66g255b33i63r69g252b37i64r71g248b40i65r74g245b44i66r76g241b47i67r79g238b51i68r83g230b57i69r86g227b61i70r88g223b64i71r91g220b68i72r93g216b71i73r96g213b75i74r98g209b78
    # i75r101g206b82i76r103g202b85i77r106g199b90i78r108g195b93i79r111g192b97i80r113g188b100i81r116g185b104i82r118g181b107i83r123g174b114i84r125g170b117i85r128g167b121i86r130g163b124i87r133g160b128i88r135g156b131i89r138g153b135i90r140g149b138i91r143g146b142i92r145g142b145i93r148g139b149i94r150g135b152i95r153g132b156i96r155g128b159i97r158g125b164i98r162g117b170i99r165g114b174i100r167g110b177i101r170g107b181i102r172g103b184i103r175g100b188i104r177g96b191i105r180g93b195i106r182g89b198i107r185g86b202i108r187g82b205i109r190g79b209i110r192g75b212i111r195g72b216i112r197g68b219i113r202g61b227i114r204g57b230i115r207g54b234i116r209g50b237i117r212g47b241i118r214g43b244i119r217g40b248i120r219g36b251i121r222g33b255i122r222g36b250i123r224g41b245i124r224g44b240i125r225g48b235i126r225g52b230i127r227g56b226i128r227g63b215i129r229g67b211i130r229g70b205i131r230g75b201i132r230g78b195i133r232g82b191i134r232g86b186i135r233g90b181i136r233g93b176i137r235g97b171i138r235g101b166i139r236g105b161i140r236g108b156i141r238g112b152
    # i142r238g116b146i143r240g124b137i144r240g127b131i145r241g131b127i146r241g135b121i147r243g139b117i148r243g142b112i149r244g146b107i150r244g150b102i151r246g154b97i152r246g157b92i153r247g162b87i154r247g165b82i155r249g169b78i156r249g172b72i157r250g177b68i158r251g184b57i159r252g188b53i160r252g191b47i161r254g196b43i162r254g199b38i163r255g203b33i164r255g201b33i165r255g200b33i166r255g198b33i167r255g198b33i168r255g196b33i169r255g195b33i170r255g193b33i171r255g192b33i172r255g190b33i173r255g188b33i174r255g186b33i175r255g185b33i176r255g183b33i177r255g182b33i178r255g180b33i179r255g179b33i180r255g177b33i181r255g176b33i182r255g175b33i183r255g174b33i184r255g172b33i185r255g171b33i186r255g169b33i187r255g168b33i188r255g165b33i189r255g164b33i190r255g162b33i191r255g161b33i192r255g159b33i193r255g158b33i194r255g156b33i195r255g155b33i196r255g153b33i197r255g153b33i198r255g151b33i199r255g149b33i200r255g146b33i201r255g144b33i202r255g141b33i203r255g137b33i204r255g134b33i205r255g133b33i206r255g130b33i207r255g128b34i208r255g125b33
    # i209r255g123b34i210r255g120b33i211r255g119b34i212r255g116b33i213r255g114b34i214r255g111b33i215r255g109b34i216r255g107b33i217r255g105b34i218r255g100b34i219r255g98b34i220r255g95b34i221r255g93b34i222r255g90b34i223r255g89b34i224r255g86b34i225r255g84b34i226r255g81b34i227r255g79b35i228r255g76b34i229r255g75b35i230r255g72b34i231r255g70b35i232r255g67b34i233r255g63b35i234r255g60b34i235r255g58b35i236r255g56b34i237r255g54b35i238r255g51b35i239r255g49b35

    # sendString("i0r255g49b35i1r255g49b35i2r255g49b35i3r255g49b35i4r255g49b35i5r255g49b35i6r249g48b41i7r244g48b48i8r233g47b61i9r228g47b67i10r222g46b73i11r217g46b80i12r211g45b86i13r206g45b93i14r200g44b99i15r195g44b106i16r189g43b112i17r184g43b119i18r178g42b125i19r174g42b132i20r168g41b138i21r163g41b145i22r157g40b151i23r146g40b165i24r140g39b171i25r135g39b177i26r129g38b183i27r125g38b190i28r119g37b196i29r114g37b203i30r108g36b209i31r103g36b216i32r97g35b222i33r92g35b229i34r86g34b235i35r81g34b242i36r75g33b248i37r70g33b255i38r81g33b241i39r87g33b234i40r93g33b227i41r99g33b220i42r104g33b213i43r111g33b207i44r116g33b199i45r122g33b193i46r127g33b185i47r134g33b179i48r139g33b171i49r145g33b165i50r151g33b158i51r157g33b151i52r162g33b144i53r174g33b130i54r179g33b123i55r186g33b116i56r191g33b109i57r197g33b103i58r203g33b95i59r209g33b89i60r214g33b81i61r220g33b75i62r226g33b67i63r232g33b61i64r237g33b53i65r244g33b47i66r249g33b40i67r255g33b33i68r245g33b42i69r241g33b48i70r235g33b52i71r231g33b57i72r226g33b62i73r221g33b67i74r216g33b71i75r212g33b77")
    # sendString("i76r206g33b81i77r202g33b86i78r197g33b91i79r192g33b96i80r187g33b100i81r183g33b106i82r177g33b110i83r168g33b120i84r163g33b124i85r159g33b130i86r153g33b134i87r149g33b139i88r144g33b144i89r139g33b149i90r134g33b153i91r130g33b159i92r124g33b163i93r120g33b168i94r115g33b173i95r110g33b178i96r105g33b182i97r101g33b188i98r91g33b197i99r86g33b202i100r81g33b206i101r77g33b212i102r71g33b216i103r67g33b221i104r62g33b226i105r57g33b231i106r52g33b235i107r48g33b241i108r42g33b245i109r38g33b250i110r33g33b255i111r41g33b250i112r47g33b245i113r63g33b236i114r70g33b231i115r78g33b226i116r84g33b221i117r92g33b217i118r99g33b211i119r107g33b207i120r114g33b202i121r122g33b198i122r129g33b192i123r137g33b188i124r144g33b183i125r152g33b178i126r158g33b173i127r166g33b169i128r181g33b159i129r189g33b154i130r195g33b149i131r203g33b145i132r210g33b139i133r218g33b135i134r225g33b130i135r233g33b126i136r240g33b120i137r248g33b116i138r255g33b111i139r248g36b116i140r240g39b120i141r234g43b125i142r226g46b129i143r212g53b139i144r204g56b143i145r198g60b148i146r190g63b152")
    # sendString("i147r184g67b158i148r176g70b162i149r169g73b167i150r162g76b171i151r155g80b176i152r147g83b180i153r141g87b185i154r133g90b190i155r126g94b195i156r119g96b199i157r112g100b204i158r97g106b213i159r90g110b218i160r83g113b222i161r76g117b227i162r68g120b231i163r62g124b237i164r54g127b241i165r47g130b246i166r40g133b250i167r33g137b255i168r40g133b250i169r48g130b245i170r55g126b239i171r63g123b235i172r70g119b229i173r85g113b220i174r92g109b214i175r100g106b210i176r107g102b204i177r115g99b199i178r121g95b194i179r129g92b189i180r136g88b184i181r144g85b179i182r151g81b174i183r159g78b169i184r166g74b163i185r174g71b159i186r181g67b153i187r189g64b149i188r203g57b138i189r211g54b134i190r218g50b128i191r226g47b123i192r232g43b118i193r240g40b113i194r247g36b108i195r255g33b103i196r255g40b100i197r255g48b98i198r255g54b95i199r255g62b93i200r255g69b90i201r255g77b88i202r255g83b84i203r255g98b80i204r255g105b77i205r255g113b75i206r255g120b72i207r255g127b69i208r255g134b66i209r255g142b64i210r255g149b61i211r255g157b59i212r255g163b56i213r255g171b54i214r255g178b51")
    # sendString("i215r255g186b49i216r255g192b46i217r255g200b43i218r255g214b38i219r255g222b36i220r255g229b33i221r255g220b33i222r255g211b33i223r255g202b33i224r255g193b33i225r255g184b34i226r255g175b33i227r255g166b34i228r255g157b33i229r255g148b34i230r255g139b34i231r255g130b34i232r255g121b34i233r255g103b35i234r255g94b34i235r255g85b35i236r255g76b34i237r255g67b35i238r255g58b35i239r255g49b35")
    lightstring = "";
    count = 0

    while True:
        db = MySQLdb.connect(host="127.0.0.1", user="root", passwd="", db="christmaslights")

        cur = db.cursor()

        cur.execute("SELECT * FROM data")
        print "Checking DB"
        newstr = "";
        for row in cur.fetchall():
            newstr = row[1]


        if (newstr != lightstring):
            count = 0
            lightstring = newstr
            sendBigString(lightstring)


        else:
            count = count +1
            if count == 600:
                createBlankColorArray()
                sendColorArray()


        db.close()

        time.sleep(1)
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