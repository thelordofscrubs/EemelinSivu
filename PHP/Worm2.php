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
}

if ($scores->length < 5) {
    pushScore();
}

if ($hs <= $scores[$scores->length]->hs) {
exit("smaller than smallest score");
} else {
    pushScore();
}






function pushScore() {
    $loc = sortScores();
    if ($scores->length <) {

    }
    $xmldom->getElementsByTagName("scorev")[]->removeChild
}

function sortScores() {
    $spot = 4;
    for($i = 0;$i < $scores->length;$i++) {
        if ($hs > ) {
            $spot = $i;
            break;
        }
    }
    return $spot;
}






?>