<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors',1);

$newComment = json_decode($_REQUEST["q"], false);
define('WEBROOT', $_SERVER['DOCUMENT_ROOT']);

class commentobj {
    public function __construct($n,$v,$t) {
        $this->name = $n;
        $this->value = $v;
        $this->timeStamp = $t;
    }
}

#$a = array();

#$newCommentOb = new commentobj($newComment->value, $newComment->name, $newComment->timeStamp);

$xml = new DomDocument();
#$xml->load(WEBROOT.'xml/vk.xml');
#for ($i = 0 ; $i < $xml->getElementsByTagName('comment')->length ; $i++) {
#    $tempOb = new commentobj($xml->getElementsByTagName('name')[$i],$xml->getElementsByTagName('value')[$i],$xml->getElementsByTagName('timeStamp')[$i]);
#    $a[$i] = $tempOb;
#}

#$a[$a->length] = $newCommentOb;
$newXMLElement = $xml->createElement('comment');
    $te = $xml->createElement('name');
        $tt = $xml->createTextNode($newComment->name);
        $te->appendChild($tt);
    $newXMLElement->appendChild($te);
    $te = $xml->createElement('value');
        $tt = $xml->createTextNode($newComment->value);
        $te->appendChild($tt);
    $newXMLElement->appendChild($te);
    $te = $xml->createElement('timeStamp');
        $tt = $xml->createTextNode($newComment->timeStamp);
        $te->appendChild($tt);
    $newXMLElement->appendChild($te);



$xml->load(WEBROOT.'/xml/vk.xml');
$xml->documentElement->appendChild($xml->importNode($newXMLElement));
$xml->save(WEBROOT.'/xml/vk.xml');
echo "reached end of php";
exit;

?>