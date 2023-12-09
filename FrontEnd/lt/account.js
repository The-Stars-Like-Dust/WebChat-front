// 发送请求用于使用uuid获取账号
axios({
    method: "post",
    url: "https://web.the-stars-like-dust.top/sel/uuid",
    data: {
        withCredentials: true,
        uuid: window.location.search.split('=')[1]
    }
})
    // 执行成功调用添加内容函数
    .then(function (response) {
        const json = response.data;
        if (json == "") {
            // window.location.href = "/index.html"
        }
        addContent(json.userName, json.id);
    })

    // 登录失败进行提示信息
    .catch(function (error) {
        console.log("请求uuid错误");
    })


// 列出好友列表并注册点击事件
var friendList = function (friendList, userNameId) {
    // 绑定ul标签
    let listAdd = document.getElementById("friend");
    // 先把好友列表渲染上
    for (let i = 0; i < friendList.length; i++) {
        listAdd.innerHTML += '<li class="haoyou-li" id="id' + friendList[i].id + '">' + friendList[i].userName + '</li>';
    }
    // 吧所有的好友进行点击事件注册
    for (let i = 0; i < friendList.length; i++) {
        document.getElementById("id" + friendList[i].id).addEventListener('click', function () {
            chattingRecords(userNameId, friendList[i].id)
            document.getElementById("information").style.display = "block";

        })
    }
}

// 像数据里面添加内容 账号,ID
var addContent = function (userName, userNameID) {
    // 更新账号
    document.getElementById("nichengs").innerText = userName;
    document.getElementById("zhanghao").innerText = userNameID;
    // 请求好友数据
    axios({
        method: "post",
        url: "https://web.the-stars-like-dust.top/sel/friends",
        data: {
            withCredentials: true,
            id: userNameID
        }
    })
        // 执行成功调用渲染好友列表函数
        .then(function (response) {
            friendList(response.data, userNameID);
        })

        // 好友获取失败进行提示信息
        .catch(function (error) {
            console.log("请求好友错误");
        })

    // 显示界面
    document.getElementById("dengdai").style.display = "none";
    document.getElementById("wai").style.display = "block";
}