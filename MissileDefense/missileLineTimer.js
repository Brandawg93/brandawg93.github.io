function timedCount() {
    postMessage("make");
    setTimeout("timedCount()", 10);
}
timedCount();