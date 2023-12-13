function showPrompt(text, yanse, time) {
    // 创建提示框元素
    var promptBox = document.createElement('div');
    promptBox.textContent = text;
    promptBox.style.position = 'fixed';
    promptBox.style.top = '10px';
    promptBox.style.right = '20px';
    promptBox.style.padding = '10px';
    promptBox.style.backgroundColor = yanse;
    promptBox.style.color = 'white';
    promptBox.style.fontWeight = '1000';

    // 将提示框添加到页面中
    document.body.appendChild(promptBox);

    // 使用 setTimeout 函数延迟3秒后隐藏提示框
    setTimeout(function () {
        promptBox.style.display = 'none';
    }, time);
}