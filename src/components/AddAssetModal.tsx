/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MarketType } from "@/src/types";

const formSchema = z.object({
  ticker: z.string().min(1, "Ticker is required").toUpperCase(),
  marketType: z.enum(["US", "GSE", "ETF"]),
  shares: z.coerce.number().positive("Shares must be positive"),
  averageCost: z.coerce.number().positive("Cost must be positive"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddAssetModalProps {
  onAdd: (values: FormValues) => void;
}

export function AddAssetModal({ onAdd }: AddAssetModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: "",
      marketType: "US",
      shares: 0,
      averageCost: 0,
    },
  });

  function onSubmit(values: FormValues) {
    onAdd(values);
    toast.success(`${values.ticker} added to portfolio`);
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 px-4">
          <Plus className="h-4 w-4" />
          Add Holding
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px] glass-card border-zinc-800 bg-zinc-950/90 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Add New Holding</DialogTitle>
          <DialogDescription className="text-zinc-400 text-xs">
            Enter asset details. Performance is tracked relative to cost basis.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="ticker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Ticker Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. AAPL, MTNGH" {...field} className="bg-zinc-900/50 border-zinc-800 focus:ring-indigo-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Market Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-900/50 border-zinc-800 focus:ring-indigo-500 text-zinc-300">
                        <SelectValue placeholder="Select market" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      <SelectItem value="US">US Stock</SelectItem>
                      <SelectItem value="ETF">US ETF</SelectItem>
                      <SelectItem value="GSE">Ghana Stock Exchange</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="shares"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Total Shares</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} className="bg-zinc-900/50 border-zinc-800 focus:ring-indigo-500 font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="averageCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Avg Cost/Share</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} className="bg-zinc-900/50 border-zinc-800 focus:ring-indigo-500 font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-xs h-11">
              Save Asset to Portfolio
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
