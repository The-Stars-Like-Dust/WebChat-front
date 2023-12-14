// 提交添加好友申请
document.getElementById("greetings-but").onclick = function () {
    // 请求好友添加
    axios.post(AjaxURL + "/ins/friendRequest", {
        id1: userNameId,
        id2: document.getElementById("requestFriendID").innerHTML,
        text: document.getElementById("greetingsText").value
    })
        // 相应成功并返回数据
        .then(function (records) {
            if (records.data == 1) {
                showPrompt("发送好友申请成功", "greenyellow", 3000);
                document.getElementById("greetingsText").value = '';
                document.getElementById("requestFriend").style.display = 'none';
            } else {
                showPrompt("发送好友申请失败", "red", 3000);
            }
        })
        // 相应失败
        .catch(function (error) {
            console.log("添加好友请求失败");
        })
}

// 点击搜索进行搜索好友添加
document.getElementById("searchFriend").onclick = function () {
    // 发送请求要申请添加好友的信息
    axios.post(AjaxURL + "/sel/queryUser", {
        name: document.getElementById("userName").value,
        inquirerID: userNameId
    })
        // 返回响应成功好友信息
        .then(function (response) {
            let rdata = response.data;
            if (rdata == "") {
                showPrompt("好友不存在", "red", 3000);
            } else if (rdata.id == null) {
                showPrompt("已添加该好友", "red", 3000);
            } else if (rdata.id == 0) {
                showPrompt("该好友请求正在待处理", "red", 3000);
            } else {
                document.getElementById("requestFriendName").innerHTML = rdata.userName;
                document.getElementById("requestFriendName").title = rdata.userName;
                document.getElementById("requestFriendID").innerHTML = rdata.id;
                document.getElementById("requestFriend").style.display = 'block';
            }
        })

        // 返回响应是失败
        .catch(function (error) {
            console.log("请求查询好友的信息");
        })
}


// 同意或者拒绝好友申请
var trueFalseFriendRequest = function (off, id, obj) {
    // 发送请求
    axios.post(AjaxURL + "/ins/FriendRequestAction", {
        pid: userNameId,
        vid: id,
        action: off
    })
        // 成功
        .then(function (response) {
            if (off) {
                addhaoyouList();
            }
        })
        // 失败 进行报错
        .catch(function (error) {
            console.log("发送结果失败，请重请求");
        })
}
// 里面存放的是申请好友的名称
var haoyouListTable = [];
var haoyouListBoolean = true;
// 添加好友点击打开并发送请求有谁向我发送好友申请
document.getElementById("addFriend-but").onclick = function () {
    document.getElementsByClassName("addFriend-frame")[0].style.display = "block";
    document.getElementById("friendApplyContentFrame").innerHTML = "";
    qingqiuhaoyouqingqiu();
    if (haoyouListBoolean)
        haoyoushenqingfor();
    haoyouListBoolean = false;
}
// 请求好友向我发送的好友申请
var qingqiuhaoyouqingqiu = function () {
    // 请求都是有谁向我发送数据
    axios.post(AjaxURL + "/sel/queryFriendRequest", {
        id: userNameId
    })
        // 执行成功渲染请求向我添加好友
        .then(function (response) {
            let rdata = response.data;
            let dgid = document.getElementById("friendApplyContentFrame");
            for (let i = 0; i < rdata.length; i++) {
                if (!(haoyouListTable.indexOf(rdata[i].pUsers.userName) >= 0)) {
                    haoyouListTable[haoyouListTable.length] = rdata[i].pUsers.userName;
                    let div = document.createElement("div");
                    let span = document.createElement("span");
                    let but1 = document.createElement("button");
                    let but2 = document.createElement("button");
                    let but3 = document.createElement("button");

                    span.textContent = rdata[i].pUsers.userName;
                    span.title = rdata[i].pUsers.userName;
                    but1.className = "friendApplyContent-but";
                    but1.textContent = "同意";
                    but1.addEventListener('click', function () {
                        trueFalseFriendRequest(true, rdata[i].pUsers.id);
                        div.remove();
                    })
                    but2.className = "friendApplyContent-but";
                    but2.textContent = "拒绝";
                    but2.addEventListener('click', function () {
                        trueFalseFriendRequest(false, rdata[i].pUsers.id);
                        div.remove();
                    })

                    but3.textContent = "弹出问候语";
                    but3.addEventListener('click', function () {
                        showPrompt(rdata[i].firstMessage, "greenyellow", 3000);
                    })

                    div.appendChild(span);
                    div.appendChild(but3);
                    div.appendChild(but1);
                    div.appendChild(but2);
                    dgid.appendChild(div);
                }
            }
        })

        // 请求向我添加好友失败
        .catch(function (error) {
            console.log("请求向我添加好友失败");
        })
}
// 计时器 —— 循环请求好友申请信息
var haoyoushenqingfor = function () {
    intervalAddhaoyou = setInterval(() => {
        qingqiuhaoyouqingqiu();
    }, 2000);
}

// 点击错号关闭添加好友
document.querySelector("#close-addFriend").onclick = function () {
    document.getElementsByClassName("addFriend-frame")[0].style.display = "none";
    // 关闭计时器
    clearInterval(intervalAddhaoyou);
    // 清空里面存的好友名
    haoyouListTable = [];
    // 开启开关能够进行计时器
    haoyouListBoolean = true;
}

// 点击错号关闭我申请好友页面
document.querySelector("#close-requestFriend").onclick = function () {
    document.getElementById("requestFriend").style.display = "none";
}