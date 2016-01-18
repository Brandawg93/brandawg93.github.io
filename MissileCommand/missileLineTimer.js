function timedCount() {
    postMessage("make");
    setTimeout("timedCount()", 100);
}
timedCount();