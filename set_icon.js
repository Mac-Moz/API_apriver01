// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, push, set, get, child, onChildAdded, remove, onChildRemoved }
    from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";


// Your web app's Firebase configuration
const firebaseConfig = {

};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); //RealtimeDBに接続
const dbRef = ref(db, "datasave"); //RealtimeDB内の"chat"を使う
const dbRef02 = ref(db, "iconsave"); //RealtimeDB内の"chat"を使う


// saveを押した時のクリックイベント htmlデータを格納
$("#icon_save").on("click", function () {
    const datasave = {
        title: $("#icon_title").val(),
        data: $(".iconset").html()
    }
    const newDatasave = push(dbRef02)
    set(newDatasave, datasave);
    alert("saveされました")
});

// pexelsからデータをダウンロードして表示

$(document).on("click", "#search_button", async function () {
    const search_word = $("#search_image").val();
    console.log("seach_word:", search_word);

    try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${search_word}`, {
            headers: {
                
            }
        });
        const data = await response.json();
        console.log("取得データ:", data);
        //検索結果を表示 
        $(".list").empty();
        displayData(data.photos);
        // グリッド設定
        const grid_column = 6;
        const grid_row = Math.ceil(data.photos.length / grid_column); //行数を計算
        $(".list").css({
            "display": "flex",
            "flex-wrap": "wrap",
            "grid-template-columns": `repeat(${grid_column}, 300px)`,
            "grid-template-rows": `repeat(${grid_row}, 300px)`

        });
    } catch (error) {
        console.error("エラーが発生しました", error);
    }
});
        
// 動的DOMの追加
function displayData(photos) {
    photos.forEach(function (photo) {
        const html = `
  <div class="dragitem_iconset outer_rap_icon">
  <div>
  <p>"${photo.id}"  "${photo.photographer}"</p>
  <img src="${photo.src.medium}" alt="Photo by ${photo.photographer}" />
</div>
</div>
`;
        $(".list").append(html);

    
    });
}

// ドラッグが開始された時の
$(document).on("mouseenter", ".dragitem_iconset", function () {
    var drag_item = null
    // 動的に作成された要素をドラッグ可能にする
    $(this).draggable({
        revert: true,
        stack: ".drop_area",
        start: function () {
            console.log("ドラッグ開始");
            drag_item = $(this).html();
            console.log("ドラッグ中のアイテム内容:",drag_item);
            
        }
    });
    // dropエリアの設定
    $('.iconset').droppable({
        drop: function () {
            $(".iconset").empty();
            $(".iconset").html(drag_item);
        }

    })

});

// $(function () {
//     // dragitmeの設定
//     $(document).on("draggable",".dragitem_iconset",function(){
//         revert: true,
//         stack: ".drop_area",

//         start: function () {
//             // drag_id = $(this).attr('id');
//             // console.log(drag_id);
//             console.log("hot")

//         }
//     });
//     // dropエリアの設定
//     $('.droparea_iconset').droppable({
//         drop: function () {

//             var flow = `
//             <textarea class="inner_content_text02 change_button" style=outline:"none" type="text">テキストを入力</textarea>
//             <img cllass="" src="img/flow04.png" alt="">
            
//             `;
//             $(".iconset").html(flow);
//         }

//     })
