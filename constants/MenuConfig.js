module.exports = {
  Admin: [
    {
      menuName: 'ダッシュボード',
      link: '/',
      authorrize: null,
      icon: 'fa fa-home',
      type: '',
      child:[]
    },{
      menuName: '管理者情報',
      link: '#',
      authorrize: null,
      icon: 'fa fa-users',
      type: 'UPDATE_USER_SEARCH',
      child:[{
        menuName: '管理者一覧',
        link: '/users',
        authorrize: null
      },{
        menuName: '新規登録',
        link: '/users/create',
        authorrize: null
      }]
    },{
      menuName: 'スタジオ基本情報',
      link: '#',
      authorrize: null,
      icon: 'fab fa-studiovinari',
      type: 'UPDATE_STUDIO_SEARCH',
      child:[{
        menuName: 'スタジオ一覧',
        link: '/studios',
        authorrize: null
      },{
        menuName: '新規登録',
        link: '/studios/create',
        authorrize: null
      }]
    },{
      menuName: 'カメラマン基本情報',
      link: '#',
      authorrize: null,
      icon: 'fas fa-camera-retro',
      type: 'UPDATE_STAFF_SEARCH',
      child:[{
        menuName: 'カメラマン・スタイリスト一覧',
        link: '/staffs',
        authorrize: null
      },{
        menuName: '新規登録',
        link: '/staffs/create',
        authorrize: null
      }]
    },{
      menuName: 'スケジュール一覧',
      link: '/staff-schedules',
      authorrize: null,
      icon: 'fa fa-calendar-alt',
      type: '',
      child:[]
    },{
      menuName: 'カメラマン報酬情報',
      link: '/staffPays',
      authorrize: null,
      icon: 'far fa-money-bill-alt',
      type: 'UPDATE_STAFF_PAY_SEARCH',
      child:[]
    },{
      menuName: '衣装情報',
      link: '#',
      authorrize: null,
      icon: 'fab fa-black-tie',
      type: '',
      child:[{
        menuName: '衣装情報一覧',
        link: '/costumes',
        authorrize: null
      },{
        menuName: '新規登録',
        link: '/costumes/create',
        authorrize: null
      }]

    },{
      menuName: '衣装ロック情報',
      link: '#',
      authorrize: null,
      icon: 'fa fa-clipboard-list',
      type: '',
      child:[{
        menuName: '衣装ロック情報一覧',
        link: '/costumeLocks',
        authorrize: null
      },{
        menuName: '新規登録',
        link: '/costumeLocks/create',
        authorrize: null
      }]
    },{
      menuName: '撮影費用情報',
      link: '#',
      authorrize: null,
      icon: 'fas fa-hand-holding-usd',
      type: '',
      child:[{
        menuName: '撮影費用情報一覧',
        link: '/plans',
        authorrize: null
      },{
        menuName: '撮影費用新規登録',
        link: '/plans/create',
        authorrize: null
      },{
        menuName: '撮影オプション情報一覧',
        link: '/planOptions',
        authorrize: null
      },{
        menuName: '撮影オプション新規登録',
        link: '/planOptions/create',
        authorrize: null
      }]
    },{
      menuName: 'クーポン情報',
      link: '#',
      authorrize: null,
      icon: 'fas fa-piggy-bank',
      type: 'UPDATE_COUPON_SEARCH',
      child:[{
        menuName: 'クーポン情報一覧',
        link: '/coupons',
        authorrize: null
      },{
        menuName: '新規登録',
        link: '/coupons/create',
        authorrize: null
      }]
    },{
      menuName: '物販商品情報',
      link: '#',
      authorrize: null,
      icon: 'fab fa-product-hunt',
      type: 'UPDATE_PRODUCT_SEARCH',
      child:[{
        menuName: '物販商品情報一覧',
        link: '/products',
        authorrize: null
      },{
        menuName: '新規登録',
        link: '/products/create',
        authorrize: null
      }]
    },{
      menuName: '会員情報',
      link: '/customers',
      authorrize: null,
      icon: 'fas fa-users',
      type: 'UPDATE_CUSTOMER_SEARCH',
      child:[]
    },{
      menuName: '予約情報',
      link: '/bookings',
      authorrize: null,
      icon: 'far fa-bell',
      type: 'UPDATE_BOOKING_SEARCH',
      child:[]
    },{
      menuName: '受注情報',
      link: '#',
      authorrize: null,
      icon: 'far fa-list-alt',
      type: 'UPDATE_ORDER_SEARCH',
      child:[{
        menuName: '受注情報一覧',
        link: '/orders',
        authorrize: null
      },{
        menuName: '新規登録',
        link: '/orders/create',
        authorrize: null
      }]
    },{
      menuName: 'ストーリー情報',
      link: '#',
      authorrize: null,
      icon: 'fas fa-search',
      type: '',
      child:[{
        menuName: 'ストーリー情報一覧',
        link: '/reviews',
        authorrize: null
      },{
        menuName: '新規作成',
        link: '/reviews/create',
        authorrize: null
      }]
    },{
      menuName: '売上情報',
      link: '/earnings',
      authorrize: null,
      icon: 'fa fa-address-card',
      type: '',
      child:[]
    },{
      menuName: 'ニュース情報',
      link: '#',
      authorrize: null,
      icon: 'fa fa-newspaper',
      type: '',
      child:[{
        menuName: 'ニュース情報一覧',
        link: '/news',
        authorrize: null
      },{
        menuName: '新規登録',
        link: '/news/create',
        authorrize: null
      }]
    },{
      menuName: 'FAQ情報',
      link: '#',
      authorrize: null,
      icon: 'far fa-question-circle',
      type: 'UPDATE_FAQ_SEARCH',
      child:[{
        menuName: 'FAQ情報一覧',
        link: '/faqs',
        authorrize: null
      },{
        menuName: '新規登録',
        link: '/faqs/create',
        authorrize: null
      }]
    }
  ],
  Staff: [
    {
      menuName: 'ダッシュボード',
      link: '/staff/home',
      authorrize: null,
      icon: 'fa fa-home',
      type: '',
      child:[]
    },{
      menuName: '予約情報',
      link: '/staff/bookings',
      authorrize: null,
      icon: 'far fa-bell',
      type: 'UPDATE_STAFF_BOOKING_SEARCH',
      child:[]
    },{
      menuName: '報酬情報',
      link: '/staff/staffPays',
      authorrize: null,
      icon: 'far fa-money-bill-alt',
      type: '',
      child:[]
    }
  ]
}
