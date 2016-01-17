function timedCount() {
    postMessage("make");
    setTimeout("timedCount()", 1000);
}
timedCount();