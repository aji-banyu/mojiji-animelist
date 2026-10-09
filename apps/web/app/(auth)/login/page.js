import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4">
      
      {/* Area Uji Coba Komponen Badge */}
      <div className="mb-6 flex gap-2">
        <Badge variant="default">Watching</Badge>
        <Badge variant="secondary">Plan to Watch</Badge>
        <Badge variant="destructive">Dropped</Badge>
      </div>

      {/* Area Uji Coba Komponen Card dan Form */}
      <Card className="w-full max-w-sm shadow-sm">
        
        <CardHeader>
          <CardTitle className="text-xl">Masuk ke Mojiji</CardTitle>
          <CardDescription>Masukkan email Anda untuk login.</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="contoh@gmail.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
          </form>
        </CardContent>
        
        <CardFooter>
          <Button className="w-full">Masuk</Button>
        </CardFooter>

      </Card>
      
    </div>
  );
}
