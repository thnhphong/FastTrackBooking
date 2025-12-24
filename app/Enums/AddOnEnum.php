<?php 

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class AddOnEnum extends Enum
{
    const AIRPORT_LOUNGE = 0;
    const HOTEL = 1;
    const SHOPPING = 2;
    const RENTAL_CAR = 3;
    const AIRLINE_TICKET = 4;

    const RESTAURANT = 5;
    const MASSAGE = 6;
    const INTERPRETATION = 7;
    const GOLF = 8;
    const FIND_SUPPLIERS = 9;

    public static function getDescriptions(): array
    {
        return [
            self::AIRPORT_LOUNGE => '空港ラウンジ',
            self::HOTEL => '日本人や外国人観光客向けのホテル',
            self::SHOPPING => 'ショッピングスポット',
            self::RENTAL_CAR => 'レンタルカー',
            self::AIRLINE_TICKET => '航空券（購入・変更等）',

            self::RESTAURANT => '日本人や外国人観光客向けのレストラン',
            self::MASSAGE => 'マッサージ・健康ケア・美容ケア',
            self::INTERPRETATION => '通訳・観光案内',
            self::GOLF => 'ゴルフ',
            self::FIND_SUPPLIERS => 'ベトナムサプライヤー探し・ベトナム会社繋がり',
        ];
    }

    /**
     * Value used when calling the external operator API.
     * Currently API expects the same numeric code as our enum value.
     */
    public static function getApiValue(int $value): int
    {
        return $value;
    }
}
