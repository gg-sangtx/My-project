module.exports = {
  Manager: [
    { name: 'ID', width: 45 },
    { name: '名前', width: 220 },
    { name: 'メールアドレス' },
    { name: '権限', width: 220 },
    { name: 'スタジオ' },
    { name: '操作', width: 110, minWidth: 110 }
  ],
  Studio: [
    { name: 'ID', width: 45 },
    { name: 'スタジオコード', width: 150 },
    { name: 'スタジオ名', width: 170 },
    { name: '都道府県', width: 150 },
    { name: '住所', minWidth: 250 },
    { name: '電話番号', width: 170 },
    { name: '操作', width: 170, minWidth: 170 }
  ],
  Costume: [
    { name: 'ID', width: 45 },
    { name: '画像', width: 130 },
    { name: '衣装コード', width: 130 },
    { name: 'タイプ', width: 130 },
    { name: '性別', width: 130 },
    { name: '衣装名', width: 200 },
    { name: 'スタジオ名', width: 130 },
    { name: 'サイズ', width: 230 },
    { name: '操作', width: 170, minWidth: 170 }
  ],
  Staff: [
    { name: 'ID', width: 45 },
    { name: '名前', width: 190 },
    { name: '名前カナ', width: 190 },
    { name: '職業', minWidth: 130 },
    { name: 'メールアドレス', width: 190 },
    { name: '電話番号', width: 170 },
    { name: 'スタジオ', width: 190 },
    { name: '直近予約スケジュール', minWidth: 180 },
    { name: '操作', width: 110, minWidth: 110 }
  ],
  Plans: [
    { name: 'ID', width: 45 },
    { name: '撮影費用コード', width: 150 },
    { name: '表示名', width: 170 },
    { name: '平日価格', width: 400 },
    { name: '休日価格', minWidth: 250 },
    { name: '操作', width: 170, minWidth: 170 }
  ],
  PlanOptions: [
    { name: 'ID', width: 45 },
    { name: '撮影オプションコード', width: 150 },
    { name: 'オプション名', width: 170 },
    { name: '単位金額', width: 400 },
    { name: '操作', width: 170, minWidth: 170 }
  ],
  CostumeLocks: [
    { name: '時間帯', width: 220 },
    { name: '衣装コード', width: 150 },
    { name: '衣装名', width: 190 },
    { name: 'スタジオコード', width: 150 },
    { name: 'スタジオ名', width: 170 },
    { name: 'カテゴリ', width: 190 },
    { name: '操作', width: 170, minWidth: 170 }
  ],
  Coupon: [
    { name: 'ID', width: 45 },
    { name: 'クーポンコード', width: 190 },
    { name: 'クーポン名', width: 190 },
    { name: '種類', width: 190 },
    { name: 'ステータス', width: 170 },
    { name: '使用開始日時', width: 220 },
    { name: '使用終了日時', width: 220 },
    { name: '操作', width: 110, minWidth: 110 }
  ],
  News: [
    { name: 'ID', width: 45 },
    { name: '公開開始日時', width: 200 },
    { name: '公開終了日時', width: 200 },
    { name: 'ステータス', width: 170 },
    { name: '画像', width: 170 },
    { name: 'タイトル', width: 400 },
    { name: '操作', width: 170, minWidth: 170 }
  ],
  Order: [
    { name: '受注コード', width: 150 },
    { name: '予約情報ID', width: 100 },
    { name: '受注日', width: 80, minWidth: 80 },
    { name: '商品名', width: 100 },
    { name: '会員名', minWidth: 100 },
    { name: '受注ステータス', minWidth: 100 },
    { name: '発送日', width: 100, minWidth: 100 },
    { name: '配送指定日時', width: 120, minWidth: 120 },
    { name: '配送伝票番号', width: 120, minWidth: 120 },
    { name: '操作', width: 130, minWidth: 130 }
  ],
  Product : [
    { name: '画像', width: 170, minWidth: 170 },
    { name: '物販商品コード', width: 200 },
    { name: '物販商品名', width: 200 },
    { name: '販売価格/定価', width: 170 },
    { name: 'サイズ', width: 170 },
    { name: '商品コード', width: 170 },
    { name: 'JANコード', width: 200 },
    { name: '操作', width: 110, minWidth: 110 }
  ],
  Reviews: [
    { name: '公開日', width: 200 },
    { name: 'カテゴリ', width: 200 },
    { name: '撮影費用タイプ名', width: 250 },
    { name: 'スタジオ名', width: 200 },
    { name: '予約コード', width: 200 },
    { name: '会員名', width: 250 },
    { name: 'タグ', width: 270 },
    { name: 'ステータス', width: 200 },
    { name: '操作', width: 170, minWidth: 170 }
  ]
}
