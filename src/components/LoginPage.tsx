/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Smartphone, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 antialiased">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-1">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader className="text-center space-y-6 pt-10">
              <div className="mx-auto bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40">
                <Wallet className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold tracking-tight text-white">
                  WealthWise<span className="text-indigo-500 italic">.</span>
                </CardTitle>
                <CardDescription className="text-zinc-400 text-sm font-medium uppercase tracking-[0.1em]">
                  The Global Portfolio Terminal
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-4 pb-12 px-10">
              <div className="space-y-4">
                <Button 
                  onClick={onLogin} 
                  className="w-full h-12 text-sm font-bold uppercase tracking-widest gap-3 bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4" />
                  Enter Terminal
                </Button>
                <p className="text-center text-[10px] text-zinc-500 font-mono tracking-wider leading-relaxed">
                  AUTHENTICATED ACCESS ONLY <br/>
                  SECURED BY ENTERPRISE ENCRYPTION
                </p>
              </div>

              <div className="pt-8 border-t border-zinc-800 grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                    <ShieldCheck className="h-3 w-3" />
                    Secure
                  </div>
                  <div className="text-[9px] text-zinc-600 font-medium">End-to-end sync</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                    <Smartphone className="h-3 w-3" />
                    Unified
                  </div>
                  <div className="text-[9px] text-zinc-600 font-medium">US & GSE Stocks</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
