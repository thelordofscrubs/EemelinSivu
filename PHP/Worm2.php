<?php

#ini_set('display_errors', 1);
#ini_set('display_startup_errors',1);

define('WEBROOT', $_SERVER['DOCUMENT_ROOT']);

$newscore = json_decode($_REQUEST["q"], false);
$hc = $_REQUEST["w"];
$scores = array();

if ($hc < $newscore->score) {
    exit("hc");
}

$score = $newscore->score;
$name = $newscore->name;
$speed = $newscore->speed;
$size = $newscore->size;
$hs = (($score/$size)*10+$score)-$speed/80+20;

$xmldom = new DomDocument();
$xmldom->load('../XML/Worm2.xml');
for ($i = 0; $i < $xmldom->getElementsByTagName("name")->length; $i++ ) {
    $scores[] = new scoreobj((int)$xmldom->getElementsByTagName("score")[$i]->firstChild->nodeValue, $xmldom->getElementsByTagName("name")[$i]->firstChild->nodeValue, (int)$xmldom->getElementsByTagName("size")[$i]->firstChild->nodeValue, (int)$xmldom->getElementsByTagName("speed")[$i]->firstChild->nodeValue, (int)$xmldom->getElementsByTagName("hs")[$i]->firstChild->nodeValue, (int)$xmldom->getElementsByTagName("scorev")[$i]->getAttribute("id"));
}


if (count($scores) < 5) {
    pushScore();
    exit("less than 5 scores");
}

if ($hs <= $scores[count($scores)-1]->hs) {
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
    global $xmldom, $score, $name, $size, $hs, $speed, $scores;
    #$loc = sortScores();
    #echo count($scores);
    if (is_array($scores)) {
        echo "true";
    }
    $loc = sortScores();
    echo $loc;
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
    
    echo "scores array length is " . count($scores);
    if (count($scores) == 5) {
        $scorevamt = $xmldom->getElementsByTagName("scorev")->length-1;
        $xmldom->getElementsByTagName("scorev")[$scorevamt]->parentNode->removeChild($xmldom->getElementsByTagName("scorev")[$scorevamt]);
    }
    echo "\n".$xmldom->saveXML()."\n";
    #$xmldom->formatOutput = true;
    if ($r = $xmldom->save(WEBROOT."/XML/Worm2.xml")) {
        echo "saved xml /xml";
        echo $r;
    } elseif ($r = $xmldom->save("../XML/Worm2.xml")) {
        echo "saved xml with ..";
        echo $r;
    } else {
        echo "failed to save xml";
    }
    
    #echo "php ran through";
}

function sortScores() {
    global $scores, $hs;
    $spot = count($scores);
    echo "
     ".$hs."
     ";
    for($i = 0;$i < count($scores); $i++) {
        echo "hs is ".$hs."
        scores hs is ".$scores[$i]->hs."
        i is ".$i."
        ";
        if ($hs > $scores[$i]->hs) {
            echo "hs is bigger than scores[".$i."]->hs
            ";
            $spot = $i;
            break;
        }else if ($hs == $scores[$i]->hs) {
            echo "hs is equal to scores hs
            ";
            $spot = $i+1;
            break;
        }
    }
    echo "
    spot".$spot."
    ";
    return $spot;
}

function cmp($a, $b) {
    return $a->hs - $b;
}
?>