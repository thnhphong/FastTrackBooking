/**
 * Utility functions to get display labels for enum values
 * Used in BookingStep3 for confirmation display
 */

export const getImmigrationPackageLabel = (value) => {
  const packages = {
    0: 'VIP_IN1_入国審査での優先レーンのみ利用(フィー：35$ )',
    1: 'VIP_IN2_入国審査での優先レーン利用＋空港の外の迎え場所への案内 (フィー：40$ )',
    2: 'VIP_IN3_ 入国審査での優先レーン利用＋荷物受取サポート＋空港の外の迎え場所への案内 (フィー：50$ )',
    3: 'VIP_IN6_VVIP最優先レーン利用・Non-stopパッケージ(フィー：300$)',
  };
  return packages[value] || value;
};

export const getEmigrationPackageLabel = (value) => {
  const packages = {
    0: '出国Fasttrackフルサポートをご利用する(50$)',
    1: '出国Fasttrackフルサポート（プレミアム優先レーン）をご利用する（65$)',
    2: ' 出国Fasttrackフルサポート（最優先レーン・ノンストップ）をご利用する（300$)',
  };
  return packages[value] || value;
};

export const getPickupVehicleLabel = (value) => {
  const vehicles = {
    0: '利用しない',
    1: '迎車 4席 (20$)',
    2: '迎車 7席 (25$)',
    3: '迎車 9席 Limousine (50$)',
  };
  return vehicles[value] || value;
};

export const getSeatingPreferenceLabel = (value) => {
  const preferences = {
    0: '希望しない',
    1: '前方 窓側',
    2: '前方 通路側',
    3: '前方 真ん中席又は窓側',
    4: '中列 窓側',
    5: '中列 通路側',
    6: '中列 真ん中席又は窓側',
    7: '後方 窓側',
    8: '後方 通路側',
    9: '後方 真ん中席又は窓側',
  };
  return preferences[value] || value;
};

export const getAirportLabel = (value) => {
  const airports = {
    '0': 'SGN - タンソンニャット空港 (Tan Son Nhat・Ho Chi Minh City)',
    '1': 'DAD - ダナン空港(Da Nang)',
    '2': 'HAN - ノイバイ(Noi Bai・Ha Noi)',
  };
  return airports[value] || value;
};

export const getContactLabel = (value) => {
  const contacts = {
    0: '加してメッセージ送った',
    1: '後でLINE追加する',
    2: 'メールだけ希望（空港で対応遅れる可能性ある）',
    3: '電話だけ希望（課金やローミングの問題発生可能性ある）',
    4: '上の番号のZALOで連絡希望',
    5: '空港で連絡手段なし、相談したい',
  };
  return contacts[value] || value;
};

export const getSurveyChannelLabel = (value) => {
  const channels = {
    0: '知り合いのご紹介',
    1: 'サービス紹介メール',
    2: 'Facebook',
    3: '広告',
    4: '検索サイト（Google、Yahooなど）',
    5: '再利用',
  };
  return channels[value] || value;
};

export const getAddOnLabel = (value) => {
  const addOns = {
    0: '空港ラウンジ',
    1: '日本人や外国人観光客向けのレストラン',
    2: '日本人や外国人観光客向けのホテル',
    3: 'マッサージ・健康ケア・美容ケア',
    4: 'ショッピングスポット',
    5: '通訳・観光案内',
    6: 'レンタルカー',
    7: 'ゴルフ',
    8: '航空券（購入・変更等）',
    9: 'ベトナムサプライヤー探し・ベトナム会社繋がり',
  };
  return addOns[value] || value;
};

export const getPaymentMethodLabel = (value) => {
  const methods = {
    0: '現金払い',
    1: 'オンラインでクレジット決済',
    2: 'ベトナム口座振込',
  };
  return methods[value] || value;
};

export const getGenderLabel = (value) => {
  return value === 'male' ? '男性' : value === 'female' ? '女性' : value;
};

// Nationality / country code label
export const getCountryLabel = (value) => {
  if (!value) return '';

  const map = {
    JPN: '日本',
    VNM: 'ベトナム',
    others: 'その他',
    japan: '日本',
    vietnam: 'ベトナム',
    // Fallback for lowercase country codes if ever used
    jpn: '日本',
    vnm: 'ベトナム',
  };

  return map[value] || value;
};

