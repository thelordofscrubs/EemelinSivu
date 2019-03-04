<?php

$newscore = json.decode($_REQUEST["q"], false);
$hc = $_REQUEST["w"];
$scores = [];

if ($hc < $newscore->score) {
    exit("hc");
}

$score = $newscore->score;
$name = $newscore->name;
$speed = $newscore->speed;
$size = $newscore->size;
$hs = (($score/$size)*10)-$speed;

$xmldom = new DomDocument();
$xmldom->load("/XML/Worm2.xml");
for ($i = 0; $i < $xmldom->getElementsByTagName("name")->length; $i++ ) {
    $scores[$i]->score = (int)$xmldom->getElementsByTagName("score")[$i]->firstChild->nodeValue;
    $scores[$i]->size = (int)$xmldom->getElementsByTagName("size")[$i]->firstChild->nodeValue;
    $scores[$i]->speed = (int)$xmldom->getElementsByTagName("speed")[$i]->firstChild->nodeValue;
    $scores[$i]->name = $xmldom->getElementsByTagName("name")[$i]->firstChild->nodeValue;
    $scores[$i]->hs = (int)$xmldom->getElementsByTagName("scoreH")[$i]->firstChild->nodeValue;
    $scores[$i]->id = $xmldom->getElementsByTagName("scorev")[$i]->getAttribute("id");
}




if ($scores->length < 5) {
    pushScore();
}

if ($hs <= $scores[$scores->length]->hs) {
exit("smaller than smallest score");
} else {
    pushScore();
}





function findID() {
    $ids = [];
    for ($i = 0; $i < $scores->length; $i++ ) {
        $ids[$i] = $scores[$i]->id;
    }
    sort($ids);
    $bid = $ids[0];

    return $bid;
}

function pushScore() {
    $loc = sortScores();
    $newscoredom = $xmldom->createElement("scorev");
    $idat = $xmldom->createAttribute("id");
    $idat->nodeValue = (findID() + 1);
    $newscoredom->setAttributeNode($idat);
    $newel = $xmldom->createElement("score");
    $newel->appendChild($xmldom->createTextNode($score));
    $newscoredom->appendChild($newel);
    $newel = $xmldom->createElement("name");
    $newel->appendChild($xmldom->createElement($name));
    $newscoredom->appendChild($newel);
    $newel = $xmldom->createElement("speed");
    $newel->appendChild($xmldom->createElement($speed));
    $newscoredom->appendChild($newel);
    $newel = $xmldom->createElement("size");
    $newel->appendChild($xmldom->createElement($size));
    $newscoredom->appendChild($newel);
    $newel = $xmldom->createElement("hs");
    $newel->appendChild($xmldom->createElement($hs));
    $newscoredom->appendChild($newel);
    $xmldom->documentElement->insertBefore($newscoredom, $xmldom->getElementsByTagNam("scorev")[$loc]);
    if ($scores->length = 5) {
        $xmldom->getElementsByTagName("scorev")[4]->removeChild($xmldom->getElementsByTagName("scorev")[4]);
    }
    $xmldom->formatOutput = true;
    $xmldom->saveXML();
}

function sortScores() {
    $spot = 4;
    for($i = 0;$i < $scores->length;$i++) {
        if ($hs > $scores[$i]->hs) {
            $spot = $i;
            break;
        }
    }
    return $spot;
}






?>