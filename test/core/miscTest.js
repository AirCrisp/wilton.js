/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(["assert", "wilton/misc", "wilton/Server"], function(assert, misc, Server) {
    "use strict";

    var server = new Server({
        tcpPort: 8080,
        views: [
            "wilton/test/core/views/hi"
        ]
    });

    misc.tcpWaitForConnection({
        ipAddress: "127.0.0.1",
        tcpPort: 8080,
        timeoutMillis: 100
    });

    server.stop();
    
    var pid = misc.spawnProcess({
        executable: "/bin/ls", 
        args: ["-l", "-a", "-h"], 
        outputFile: "miscTest_out.txt",
        awaitExit: false
    });
    assert(pid > 0);

});