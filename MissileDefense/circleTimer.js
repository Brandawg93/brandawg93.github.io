function timedCount() {
    postMessage("make");
    setTimeout("timedCount()", 50);
}
timedCount();