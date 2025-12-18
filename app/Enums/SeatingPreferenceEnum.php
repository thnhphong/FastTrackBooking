<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class SeatingPreferenceEnum extends Enum
{
    // 1st image: seatingPreferences (0..9 in operator order)
    const NO_PREFERENCE                    = 0; // 希望しない
    const FRONT_WINDOW                     = 1; // 前方 窓側
    const FRONT_AISLE                      = 2; // 前方 通路側
    const FRONT_MIDDLE_OR_WINDOW          = 3; // 前方 真ん中席又は窓側
    const MIDDLE_WINDOW                    = 4; // 中列 窓側
    const MIDDLE_AISLE                     = 5; // 中列 通路側
    const MIDDLE_MIDDLE_OR_WINDOW        = 6; // 中列 真ん中席又は窓側
    const BACK_WINDOW                      = 7; // 後方 窓側
    const BACK_AISLE                       = 8; // 後方 通路側
    const BACK_MIDDLE_OR_WINDOW          = 9; // 後方 真ん中席又は窓側

    public static function getDescriptions(): array
    {
        return [
            self::NO_PREFERENCE             => 'No preference', // 希望しない
            self::FRONT_WINDOW              => 'Front row, window side', // 前方 窓側
            self::FRONT_AISLE               => 'Front row, aisle side', // 前方 通路側
            self::FRONT_MIDDLE_OR_WINDOW    => 'Front row, middle or window seat', // 前方 真ん中席又は窓側
            self::MIDDLE_WINDOW             => 'Middle row, window side', // 中列 窓側
            self::MIDDLE_AISLE              => 'Middle row, aisle side', // 中列 通路側
            self::MIDDLE_MIDDLE_OR_WINDOW   => 'Middle row, middle or window seat', // 中列 真ん中席又は窓側
            self::BACK_WINDOW               => 'Back row, window side', // 後方 窓側
            self::BACK_AISLE                => 'Back row, aisle side', // 後方 通路側
            self::BACK_MIDDLE_OR_WINDOW     => 'Back row, middle or window seat', // 後方 真ん中席又は窓側
        ];
    }
}


