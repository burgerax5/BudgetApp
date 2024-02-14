import { useState, useEffect } from 'react'
import BasicInformation from "@/components/profile/BasicInformation";
import ProfileNav from "@/components/profile/ProfileNav";
import { show2FAForm } from '@/store/userStore';
import { useStore } from '@nanostores/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import axios from '@/api/axios';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const ProfilePage = () => {
    const $show2FAForm = useStore(show2FAForm)
    const [secret, setSecret] = useState<{
        ascii: string,
        hex: string,
        base32: string,
        otpauth_url: string
    } | null>(null)
    const [qrcode, setQRCode] = useState<string | null>(null)
    const [otp, setOTP] = useState<string>("")

    useEffect(() => {
        const getQRCode = async () => {
            await axios.get('/auth/get-2fa-secret', { withCredentials: true })
                .then(res => {
                    console.log(res.data.secret)
                    setSecret(res.data.secret)
                    setQRCode(res.data.qrcode)
                })
        }

        if ($show2FAForm) {
            getQRCode()
        }
    }, [$show2FAForm])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOTP(e.target.value)
    }

    const handle2FASubmit = async () => {
        await axios.post('/auth/verify-otp', {
            secret: secret?.ascii,
            token: otp,
        }, { withCredentials: true })
            .then(res => {
                if (res.data) location.reload()
            })
    }

    return (
        <>
            <ProfileNav page="profile" />
            <div className="w-[360px] p-8 rounded-md flex flex-col items-center">
                <BasicInformation />
            </div>
            {$show2FAForm &&
                <div
                    className="w-full h-full absolute flex items-center justify-center"
                >
                    <Card className="z-[10]">
                        <CardHeader>
                            <CardTitle>Enable 2FA</CardTitle>
                            <CardDescription>Using the Google Authenticator app, scan the QR code.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center flex-col gap-3.5">
                            {
                                qrcode ?
                                    <>
                                        <img src={qrcode} />
                                        <Input value={otp} onChange={handleInputChange} />
                                    </>
                                    : "Could not generate QR code"
                            }
                        </CardContent>
                        <CardFooter>
                            <Button className="ml-auto" onClick={handle2FASubmit}>Submit</Button>
                        </CardFooter>
                    </Card>
                    <div className="w-full h-full bg-black absolute opacity-40"
                        onClick={() => show2FAForm.set(false)}></div>
                </div>
            }
        </>
    )
}

export default ProfilePage