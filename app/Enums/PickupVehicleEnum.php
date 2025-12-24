<?php 

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class PickupVehicleEnum extends Enum
{
    // Numeric codes in operator order
    const NO = 0;
    const SEAT_4 = 1;
    const SEAT_7 = 2;
    const LIMO_7 = 3;

    public static function getDescriptions(): array
    {
        return [
            self::NO     => '利用しない',
            self::SEAT_4 => '迎車 4席 (20$)',
            self::SEAT_7 => '迎車 7席 (25$)',
            self::LIMO_7 => '迎車 9席 Limousine (50$)',
        ];
    }

    public static function getApiValue(int $value): int
    {
        return $value;
    }
}
