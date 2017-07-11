/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define([
    "assert",
    "wilton/Server",
    "wilton/misc",
    "wilton/test/core/helpers/httpClientHelper"
], function(assert, Server, misc, clientHelper) {
    "use strict";

    var certdir = misc.getWiltonConfig().requireJsConfig.baseUrl + "/wilton/test/certificates/";
    
    var server = new Server({
        tcpPort: 8443,
        views: [
            "wilton/test/core/views/hi",
            "wilton/test/core/views/postmirror",
            "wilton/test/core/views/reqheader",
            "wilton/test/core/views/resperror",
            "wilton/test/core/views/respfooheader",
            "wilton/test/core/views/respjson"
        ],
        ssl: {
            keyFile: certdir + "server/localhost.pem",
            keyPassword: "test",
            verifyFile: certdir + "server/staticlibs_test_ca.cer",
            verifySubjectSubstr: "CN=testclient"
        }
    });      
    
    var meta = {
        sslcertFilename: certdir + "client/testclient.pem",
        sslcertype: "PEM",
        sslkeyFilename: certdir + "client/testclient.pem",
        sslKeyType: "PEM",
        sslKeypasswd: "test",
        requireTls: true,
        sslVerifyhost: true,
        sslVerifypeer: true,
        cainfoFilename: certdir + "client/staticlibs_test_ca.cer"
    };

    var prefix = "https://localhost:8443/wilton/test/core/views/";
    assert(404 === clientHelper.httpGetCode(prefix + "foo", meta));
    assert("Hi from wilton_test!" === clientHelper.httpGet(prefix + "hi", meta));
    var getjson = clientHelper.httpGet(prefix + "respjson", meta);
    var getresp = JSON.parse(getjson);
    assert(1 === getresp.foo);
    assert("baz" === getresp.bar);
    assert("Error triggered" === clientHelper.httpGet(prefix + "resperror", meta));
    assert("localhost:8443" === clientHelper.httpGet(prefix + "reqheader", meta));
    assert("header set" === clientHelper.httpGet(prefix + "respfooheader", meta));
    assert("foo" === clientHelper.httpGetHeader(prefix + "respfooheader", "X-Foo", meta));
    assert("foobar" === clientHelper.httpPost(prefix + "postmirror", "foobar", meta));

    // optional
    server.stop();
    
});