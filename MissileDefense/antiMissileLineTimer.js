function timedCount() {
    postMessage("make");
    setTimeout("timedCount()", 1);
}
timedCount();