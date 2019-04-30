<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors',1);

$newComment = json_decode($_REQUEST["q"], false);
define('WEBROOT', $_SERVER['DOCUMENT_ROOT']);

#echo $newComment;
#echo 'Same but with json encode: '.json_encode($newComment);

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
$newxml = new DomDocument();
$newXMLElement = $newxml->createElement('comment');
    $te = $newxml->createElement('name');
        $tt = $newxml->createTextNode($newComment->name);
        $te->appendChild($tt);
    $newXMLElement->appendChild($te);
    $te = $newxml->createElement('value');
        $tt = $newxml->createTextNode($newComment->value);
        $te->appendChild($tt);
    $newXMLElement->appendChild($te);
    $te = $newxml->createElement('timeStamp');
        $tt = $newxml->createTextNode($newComment->timeStamp);
        $te->appendChild($tt);
    $newXMLElement->appendChild($te);



$xml->load(WEBROOT.'/XML/vk.xml');
$xml->documentElement->appendChild($xml->importNode($newXMLElement));
$xml->formatOutput = true;
$xml->save(WEBROOT.'/XML/vk.xml');
echo "reached end of php";
exit;

?>