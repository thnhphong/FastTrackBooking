/**
 * Shared constants for booking form options
 * These match the API requirements and enum values
 */

export const airports = [
  { value: 0, code: 'SGN', label: 'SGN - タンソンニャット空港 (Tan Son Nhat・Ho Chi Minh City)' },
  { value: 1, code: 'DAD', label: 'DAD - ダナン空港(Da Nang)' },
  { value: 2, code: 'HAN', label: 'HAN - ノイバイ(Noi Bai・Ha Noi)' },
];

// entry_fast_track_option: 0=35$,1=40$,2=50$,3=300$
export const immigrationPackages = [
  { value: 0, priceKey: '35$', label: 'VIP_IN1_入国審査での優先レーンのみ利用(フィー：35$ )' },
  { value: 1, priceKey: '40$', label: 'VIP_IN2_入国審査での優先レーン利用＋空港の外の迎え場所への案内 (フィー：40$ )' },
  { value: 2, priceKey: '50$', label: 'VIP_IN3_ 入国審査での優先レーン利用＋荷物受取サポート＋空港の外の迎え場所への案内 (フィー：50$ )' },
  { value: 3, priceKey: '300$', label: 'VIP_IN6_VVIP最優先レーン利用・Non-stopパッケージ(フィー：300$)' },
];

// departure_fast_track_option: 0=50$,1=300$
export const emigrationPackages = [
  { value: 0, priceKey: '50$', label: '出国Fasttrackフルサポートをご利用する(50$)' },
  { value: 1, priceKey: '65$', label: '出国Fasttrackフルサポート（プレミアム優先レーン）をご利用する（65$)' },
  { value: 2, priceKey: '300$', label: ' 出国Fasttrackフルサポート（最優先レーン・ノンストップ）をご利用する（300$)' },
];

export const pickupVehicles = [
  { value: 0, label: '利用しない' },
  { value: 1, label: '迎車 4席 (20$)' },
  { value: 2, label: '迎車 7席 (25$)' },
  { value: 3, label: '迎車 9席 Limousine (50$)' },
];

export const seatingPreferences = [
  { value: 0, label: '希望しない' },
  { value: 1, label: '前方 窓側' },
  { value: 2, label: '前方 通路側' },
  { value: 3, label: '前方 真ん中席又は窓側' },
  { value: 4, label: '中列 窓側' },
  { value: 5, label: '中列 通路側' },
  { value: 6, label: '中列 真ん中席又は窓側' },
  { value: 7, label: '後方 窓側' },
  { value: 8, label: '後方 通路側' },
  { value: 9, label: '後方 真ん中席又は窓側' },
];

export const surveyChannels = [
  { value: 0, label: '知り合いのご紹介' },
  { value: 1, label: 'サービス紹介メール' },
  { value: 2, label: 'Facebook' },
  { value: 3, label: '広告' },
  { value: 4, label: '検索サイト（Google、Yahooなど）' },
  { value: 5, label: '再利用' },
];

export const contactOptions = [
  { value: 0, label: '加してメッセージ送った' },
  { value: 1, label: '後でLINE追加する' },
  { value: 2, label: 'メールだけ希望（空港で対応遅れる可能性ある）' },
  { value: 3, label: '電話だけ希望（課金やローミングの問題発生可能性ある）' },
  { value: 4, label: '上の番号のZALOで連絡希望' },
  { value: 5, label: '空港で連絡手段なし、相談したい' },
];

export const addOnsOptions = [
  { value: 0, label: '空港ラウンジ' },
  { value: 1, label: '日本人や外国人観光客向けのレストラン' },
  { value: 2, label: '日本人や外国人観光客向けのホテル' },
  { value: 3, label: 'マッサージ・健康ケア・美容ケア' },
  { value: 4, label: 'ショッピングスポット' },
  { value: 5, label: '通訳・観光案内' },
  { value: 6, label: 'レンタルカー' },
  { value: 7, label: 'ゴルフ' },
  { value: 8, label: '航空券（購入・変更等）' },
  { value: 9, label: 'ベトナムサプライヤー探し・ベトナム会社繋がり' },
];

