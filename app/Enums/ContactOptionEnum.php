<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ContactOptionEnum extends Enum
{
    // 2nd image: contactOptions (0..5 in operator order)
    const LINE_ADDED_AND_MESSAGE_SENT      = 0; // 加してメッセージ送った
    const ADD_LINE_LATER                   = 1; // 後でLINE追加する
    const EMAIL_ONLY_AT_AIRPORT            = 2; // メールだけ希望（空港で対応）
    const PHONE_ONLY                       = 3; // 電話だけ希望（料金やローミ…）
    const ZALO_AT_ABOVE_NUMBER             = 4; // 上の番号のZALOで連絡希望
    const NO_CONTACT_AT_AIRPORT_CONSULT    = 5; // 空港で連絡手段なし、相談し…

    public static function getDescriptions(): array
    {
        return [
            self::LINE_ADDED_AND_MESSAGE_SENT   => 'Added LINE OA and sent message',
            self::ADD_LINE_LATER                => 'Will add LINE later',
            self::EMAIL_ONLY_AT_AIRPORT         => 'Email only (handled at airport)',
            self::PHONE_ONLY                    => 'Phone only (call contact)',
            self::ZALO_AT_ABOVE_NUMBER          => 'Contact via Zalo at the above number',
            self::NO_CONTACT_AT_AIRPORT_CONSULT => 'No contact method at airport, consult on site',
        ];
    }
}


