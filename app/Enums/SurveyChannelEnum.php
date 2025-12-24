<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class SurveyChannelEnum extends Enum
{
    // 3rd image: surveyChannels (0..5 in operator order)
    const INTRODUCTION_BY_ACQUAINTANCE = 0; // 知り合いのご紹介
    const SERVICE_INTRODUCTION_EMAIL   = 1; // サービス紹介メール
    const FACEBOOK                     = 2; // Facebook
    const ADVERTISEMENT                = 3; // 広告
    const SEARCH_ENGINE                = 4; // 検索サイト（Google、Yahoo等）
    const REUSE                        = 5; // 再利用

    public static function getDescriptions(): array
    {
        return [
            self::INTRODUCTION_BY_ACQUAINTANCE => '知り合いのご紹介',
            self::SERVICE_INTRODUCTION_EMAIL   => 'サービス紹介メール',
            self::FACEBOOK                     => 'Facebook', // Facebook
            self::ADVERTISEMENT                => '広告',
            self::SEARCH_ENGINE                => '検索サイト（Google、Yahoo等）',
            self::REUSE                        => '再利用',
        ];
    }

    public static function getApiValue(int $value): int
    {
        return $value;
    }
}


