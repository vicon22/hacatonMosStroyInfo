import { NextResponse } from 'next/server';
import { Message } from '@/entities/messages/types';

export async function GET() {
    return NextResponse.json<Message[]>([
        {
            userId: '167',
            roomId: '187346782',
            message: 'Василичь! Заатра приедет ландшафтный дизайнер, побрейся!'
        },
        {
            userId: '874',
            roomId: '187346782',
            message: 'Ага, хорошо, во сколько?'
        },
        {
            userId: '167',
            roomId: '187346782',
            message: 'Часов в 10'
        },
        {
            userId: '167',
            roomId: '187346782',
            message: 'А! еще придет замерщик бассена в 12 и привезут забор в 4'
        },
        {
            userId: '874',
            roomId: '187346782',
            message: 'Приято!'
        },
        {
            userId: '874',
            roomId: '187346782',
            message: 'На следующей недели начнем заливать и засыпать'
        },
        {
            userId: '167',
            roomId: '187346782',
            message: 'Отлично!'
        },
    ]);
}
