<?php

$scoreob = json.decode($_REQUEST["q"], false);
$hc = $_REQUEST["w"];

if $hc < ($scoreob->score) {
    exit("hc");
}

$score = $scoreob->score;
$name = $scoreob->name;
$speed = $scoreob->speed;
$size = $scoreob->size;

$xmldom = new DomDocument();
$xmldom->load("/XML/Worm2.xml");

if $














?>