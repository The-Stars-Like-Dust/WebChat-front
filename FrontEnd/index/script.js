$("#signup").click(function () {
    $(".pinkbox").css("transform", "translateX(80%)");
    $(".signin").addClass("nodisplay");
    $(".signup").removeClass("nodisplay")
});

$("#signin").click(function () {
    $(".pinkbox").css("transform", "translateX(0%)");
    $(".signup").addClass("nodisplay");
    $(".signin").removeClass("nodisplay")
});


// 登录模块
var dlBut = function () {
    axios.post("https://39.98.109.91/sel/users", {
        withCredentials: true,
        userName: document.getElementById("d_zh").value,
        password: document.getElementById("d_mm").value
    })
        // 执行成功进行跳转
        .then(function (response) {
            const data = response.data;

            // 判断是否返回成功
            if (typeof (date) == "string" || data == 'passwordError') {
                showPrompt("登录失败,可能是账号密码错误", "red", 3000);
            } else {
                showPrompt("登录成功", "greenyellow", 3000);
                window.location.href = "/lt.html?uuid=" + data;
            }
        })
        // 登录失败进行提示信息
        .catch(function (error) {
            showPrompt("请求登录失败", "red", 3000);
        })
}

// 注册模块
var zcBut = function () {
    axios.post("https://39.98.109.91/ins/user", {
        userName: document.getElementById("z_zh").value,
        password: document.getElementById("z_mm").value
    })
        // 执行注册成功进行跳转
        .then(function (response) {
            if (response.data == 'lengthError') {
                showPrompt("注册失败，密码和账号要求 6-20 位之间", "red", 3000);
            } else if (response.data == 'existError') {
                showPrompt("注册失败，账号已存在", "red", 3000);
            } else {
                showPrompt("注册成功", "greenyellow", 3000);
            }
        })
        // 注册失败进行提示信息
        .catch(function (error) {
            showPrompt("请求注册失败", "red", 3000);
        })
}