<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors',1);

$newComment = json_decode($_REQUEST["q"], false);
define('WEBROOT', $_SERVER['DOCUMENT_ROOT']);

class commentobj {
    public function __construct(n,v,t) {
        $this->name = $n;
        $this->value = $v;
        $this->timeStamp = $t;
    }
}

$newCommentOb = new commentobj($newComment->value, $newComment->name, $newComment->timeStamp);

$xml = new



?>