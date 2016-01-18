function timedCount() {
    postMessage("make");
    setTimeout("timedCount()", 2000);
}
timedCount();