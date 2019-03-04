<?php

$newscore = json_decode($_REQUEST["q"], false);
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
$xmldom->load('../XML/Worm2.xml');
for ($i = 0; $i < $xmldom->getElementsByTagName("name")->length; $i++ ) {
    $scores[$i] = new scoreobj((int)$xmldom->getElementsByTagName("score")[$i]->firstChild->nodeValue, $xmldom->getElementsByTagName("name")[$i]->firstChild->nodeValue, (int)$xmldom->getElementsByTagName("size")[$i]->firstChild->nodeValue, (int)$xmldom->getElementsByTagName("speed")[$i]->firstChild->nodeValue, (int)$xmldom->getElementsByTagName("scoreH")[$i]->firstChild->nodeValue, (int)$xmldom->getElementsByTagName("scorev")[$i]->getAttribute("id"));
}


if (count($scores) < 5) {
    pushScore();
    exit;
}

if ($hs <= $scores[count($scores)]->hs) {
exit("smaller than smallest score");
} else {
    pushScore();
    exit;
}

class scoreobj {
    public function __construct($sc, $na, $si, $sp, $hs, $id) {
    $this->score = $sc;
    $this->name = $na;
    $this->size = $si;
    $this->speed = $sp;
    $this->hs = $hs;
    $this->id = $id;
    }
}


function findID() {
    global $scores;
    $ids = [];
    for ($i = 0; $i < count($scores); $i++ ) {
        $ids[$i] = $scores[$i]->id;
    }
    rsort($ids);
    $bid = $ids[0];

    return $bid;
}

function pushScore() {
    $loc = sortScores();
    global $xmldom, $score, $name, $size, $hs, $speed, $scores;
    $newscoredom = $xmldom->createElement("scorev");
    $idat = $xmldom->createAttribute("id");
    $idat->nodeValue = (findID() + 1);
    $newscoredom->setAttributeNode($idat);
    $newel = $xmldom->createElement("score");
    $newel->appendChild($xmldom->createTextNode($score));
    $newscoredom->appendChild($newel);
    $newel = $xmldom->createElement("name");
    $newel->appendChild($xmldom->createTextNode($name));
    $newscoredom->appendChild($newel);
    $newel = $xmldom->createElement("speed");
    $newel->appendChild($xmldom->createTextNode($speed));
    $newscoredom->appendChild($newel);
    $newel = $xmldom->createElement("size");
    $newel->appendChild($xmldom->createTextNode($size));
    $newscoredom->appendChild($newel);
    $newel = $xmldom->createElement("hs");
    $newel->appendChild($xmldom->createTextNode($hs));
    $newscoredom->appendChild($newel);
    $xmldom->documentElement->insertBefore($newscoredom, $xmldom->getElementsByTagName("scorev")[$loc]);
    echo $xmldom->saveXML();
    echo "scores array length is " . count($scores);
    if (count($scores) == 5) {
        $xmldom->getElementsByTagName("scorev")[4]->parentNode->removeChild($xmldom->getElementsByTagName("scorev")[4]);
    }
    $xmldom->formatOutput = true;
    $xmldom->save("../XML/Worm2.xml");
    echo "php ran through";
}

function sortScores() {
    $spot = 4;
    global $scores, $hs;
    for($i = 0;$i < count($scores);$i++) {
        if ($hs > $scores[$i]->hs) {
            $spot = $i;
            break;
        }
    }
    return $spot;
}
?>