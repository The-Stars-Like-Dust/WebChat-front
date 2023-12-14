// 渲染聊天记录
var chattingRecordsXR = function (data) {
    // 按照时间排序
    data.sort(function (a, b) {
        return b.time > a.time ? -1 : 1
    })

    // 渲染页面
    for (let i = 0; i < data.length; i++) {
        let info = document.getElementById("info");
        let me_you = null;
        if (data[i].user1.id == userNameId) {
            me_you = "me";
        } else {
            me_you = "you";
        }
        info.innerHTML +=
            '<div class="' + me_you + '">' +
            '<p class="datetime">' + data[i].time + '</p>' +
            '<p class="text">' + data[i].text + '</p>' +
            '</div>'
    }

    // 聊天记录滑动到最底部
    let scrollAera = document.getElementById("info");
    scrollAera.scrollTop = scrollAera.clientHeight * 5;
}


// 用于判定不重复开启计时器
var jsqid = -1;
// 获取聊天记录
var chattingRecords = function (user2_id) {
    // 请求我向好友发送的聊天数据
    axios.post(AjaxURL + "/sel/messages", {
        withCredentials: true,
        id1: userNameId,
        id2: user2_id
    })
        // 执行成功调用渲染好友聊天记录函数
        .then(function (response1) {
            let data1 = response1.data;
            let data2 = null;
            // 请求好友向我发送的聊天数据
            axios.post(AjaxURL + "/sel/messages", {
                withCredentials: true,
                id1: user2_id,
                id2: userNameId
            })
                // 执行成功调用渲染好友向我聊天记录函数
                .then(function (response2) {
                    data2 = response2.data;
                    for (let i = 0; i < data2.length; i++) {
                        data1[data1.length] = data2[i];
                    }
                    // 清空消息列表
                    document.getElementById("info").remove();
                    document.getElementById("information").innerHTML =
                        '<div id="infoConfig">' +
                        '<span>' + data1[0].user2.userName + '</span>' +
                        '<button id="remove' + user2_id + '">删除好友</button>' +
                        '</div>' +
                        '<div id="info"> </div>' +
                        '<div id="input_from">' +
                        '<form>' +
                        '<textarea name="input_text" id="text_con" style="resize: none; outline: 0 none;"' +
                        'placeholder="这里输入内容"></textarea>' +
                        '<input type="button" onclick="faSong()" value="发送">' +
                        '</form>' +
                        '</div >'

                    // 进行删除好友操作
                    document.getElementById("remove" + user2_id).onclick = function () {
                        if (prompt("这是不可逆的操作\n如果确认删除，请输入\"删除\"") == "删除") {
                            axios.post(AjaxURL + "/ins/deleteFriend", {
                                id1: userNameId,
                                id2: user2_id
                            })
                                .then(function (response) {
                                    if (response.data == "success") {
                                        showPrompt("删除成功", "greenyellow", 500);
                                        // 清除好友列表
                                        document.getElementById("id" + user2_id).remove();
                                        document.getElementById("information").style.display = "none";
                                    } else {
                                        showPrompt("删除失败", "red", 500);
                                    }
                                })
                                .error(function (error) {
                                    console.log("删除请求好友错误");
                                })
                        }
                    }

                    // 调用函数渲染页面
                    chattingRecordsXR(data1);
                    // 好友ID
                    text_haoyou_id = user2_id;

                    if (user2_id != jsqid) {
                        jsqid = user2_id;
                        // 关闭计时器
                        clearInterval(intervalId);
                        // 开启计时器
                        jsq();
                    }
                })

                // 好友向我聊天记录获取失败进行提示信息
                .catch(function (error) {
                    console.log("请求好友向我聊天记录错误");
                })


        })

        // 好友聊天记录获取失败进行提示信息
        .catch(function (error) {
            console.log("请求我向好友聊天记录错误");
        })
}




// 发送消息
var faSong = function () {
    let _test = document.getElementById("text_con").value;
    document.getElementById("text_con").value = "";
    // 发送消息请求
    axios.post(AjaxURL + "/ins/message", {
        withCredentials: true,
        id1: userNameId,
        id2: text_haoyou_id,
        text: _test
    })
        // 执行成功调用渲染好友向我聊天记录函数
        .then(function (response) {
            // 发送成功
            showPrompt("发送成功", "greenyellow", 500);
        })

        // 发送失败
        .catch(function (error) {
            showPrompt("发送失败未能请求到服务器", "red", 1000);
        })
}



// 计时器 —— 用于接受聊天记录请求
var jsq = function () {
    intervalId = setInterval(function () {
        // 发送请求用于获取一个时间以下我向好友发送的聊天记录
        axios.post(AjaxURL + "/sel/messages/time", {
            withCredentials: true,
            id1: userNameId,
            id2: text_haoyou_id,
            time: document.getElementsByClassName("me")[document.getElementsByClassName("me").length - 1].getElementsByClassName("datetime")[0].innerHTML
        })
            // 成功
            .then(function (response1) {
                // 定义两个变量
                let data1 = response1.data;
                let data2 = null;

                // 发送请求用于获取一个时间以下好友向我发送的聊天记录
                axios.post(AjaxURL + "/sel/messages/time", {
                    withCredentials: true,
                    id1: text_haoyou_id,
                    id2: userNameId,
                    time: document.getElementsByClassName("you")[document.getElementsByClassName("you").length - 1].getElementsByClassName("datetime")[0].innerHTML
                })
                    // 成功
                    .then(function (response2) {
                        // 把数据链接在一起
                        data2 = response2.data;
                        for (let i = 0; i < data2.length; i++) {
                            data1[data1.length] = data2[i];
                        }
                        // 渲染数据
                        if (data1.length != 0) {
                            chattingRecordsXR(data1);
                        }
                    })

                    .catch(function (error) {
                        console.log("好友向我错误");
                    })
            })

            .catch(function (error) {
                console.log("我向好友错误");
            })
    }, 1000); // 每隔 1 秒执行一次
}