/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  ArrowRight, 
  Maximize2, 
  Layers, 
  Zap, 
  Download,
  RotateCcw,
  Camera,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { analyzeProductPhoto, ImageAnalysis } from './services/geminiService';
import confetti from 'canvas-confetti';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        setImage(base64);
        setIsAnalyzing(true);
        try {
          const result = await analyzeProductPhoto(base64.split(',')[1]);
          setAnalysis(result);
        } catch (error) {
          console.error("Analysis failed:", error);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    // Implementation for download would go here
  };

  const reset = () => {
    setImage(null);
    setAnalysis(null);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white">
      <AnimatePresence mode="wait">
        {!image ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            {/* Nav */}
            <nav className="container mx-auto px-6 py-8 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Camera className="text-white w-5 h-5" />
                </div>
                <span className="font-display font-bold text-xl tracking-tight">StudioSnap<span className="text-muted-foreground">.ai</span></span>
              </div>
              <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
                <Button variant="outline" className="rounded-full px-6 border-muted-foreground/20 text-muted-foreground hover:text-foreground">Login</Button>
              </div>
            </nav>

            {/* Hero Section */}
            <main className="container mx-auto px-6 pt-20 pb-32">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground font-medium border-none">
                    <Sparkles className="w-3.5 h-3.5 mr-2 text-amber-500 fill-amber-500" />
                    Trusted by 10,000+ Shopify Sellers
                  </Badge>
                </motion.div>
                
                <h1 className="font-display font-bold text-6xl md:text-8xl tracking-tighter leading-[0.9] text-foreground">
                  Product photos that <br />
                  <span className="text-muted-foreground/40">actually convert.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Turn messy smartphone snaps into studio-quality images in seconds. 
                  Optimized for Amazon, Shopify, and Instagram.
                </p>

                <div className="pt-8">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative inline-block cursor-pointer"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/20 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <Button size="lg" className="relative h-16 px-10 rounded-full text-lg bg-primary hover:bg-primary/90 text-white shadow-2xl transition-all hover:scale-105">
                      Upload your image
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleUpload} 
                    />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">No credit card required • Free forever for basics</p>
                </div>
              </div>

              {/* Instant Demo Visual */}
              <div id="demo" className="mt-24 max-w-5xl mx-auto relative rounded-3xl overflow-hidden border border-border bg-card shadow-2xl">
                <div className="aspect-[16/9] flex items-center justify-center bg-muted/20 relative group">
                  <div className="absolute inset-0 flex">
                    <div className="w-[50%] bg-[url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=2000')] bg-cover grayscale opacity-30 border-r border-white/10 relative">
                       <Badge className="absolute top-4 left-4 bg-white/10 backdrop-blur text-white border-none">Before</Badge>
                    </div>
                    <div className="w-[50%] bg-[url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=2000')] bg-cover relative">
                       <Badge className="absolute top-4 right-4 bg-primary/90 text-white border-none">Studio Quality</Badge>
                    </div>
                  </div>
                  <div className="absolute inset-y-0 left-[50%] w-0.5 bg-white/20 shadow-lg pointer-events-none">
                    <div className="absolute top-[50%] -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-slate-900 rotate-180" />
                      <ArrowRight className="w-4 h-4 text-slate-900 ml-[-4px]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* How it Works */}
              <div className="mt-32 grid md:grid-cols-3 gap-12 text-center">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto text-foreground font-bold">1</div>
                  <h3 className="font-display font-bold text-xl text-foreground">Upload Snap</h3>
                  <p className="text-muted-foreground text-sm">Upload any smartphone photo. Our AI understands product geometry instantly.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto text-foreground font-bold">2</div>
                  <h3 className="font-display font-bold text-xl text-foreground">AI Enhancement</h3>
                  <p className="text-muted-foreground text-sm">Gemini 3.1 Pro analyzes lighting and color to suggest precision studio edits.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto text-foreground font-bold">3</div>
                  <h3 className="font-display font-bold text-xl text-foreground">Export HD</h3>
                  <p className="text-muted-foreground text-sm">Download assets optimized for Shopify, Amazon, and higher conversion rates.</p>
                </div>
              </div>
            </main>

            {/* Social Proof */}
            <section className="bg-muted/30 border-y border-border py-16">
               <div className="container mx-auto px-6 overflow-hidden">
                 <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-10">Trusted by Global Brands</p>
                 <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale items-center text-foreground">
                   <div className="font-display font-black text-2xl">SHOPIFY</div>
                   <div className="font-display font-black text-2xl">AMAZON</div>
                   <div className="font-display font-black text-2xl">ETSY</div>
                   <div className="font-display font-black text-2xl">WOO</div>
                   <div className="font-display font-black text-2xl">EBAY</div>
                 </div>
               </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="h-screen flex flex-col md:flex-row overflow-hidden bg-background"
          >
            {/* Editor Sidebar */}
            <aside className="w-full md:w-96 border-r border-border flex flex-col bg-card">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div onClick={reset} className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Camera className="text-white w-5 h-5" />
                  </div>
                  <span className="font-display font-bold text-lg tracking-tight">StudioSnap</span>
                </div>
                <Button variant="ghost" size="icon" onClick={reset} className="text-muted-foreground hover:text-foreground">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-6 space-y-8">
                  {/* AI Analysis Cards */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">AI Analysis</p>
                    {isAnalyzing ? (
                      <Card className="border-dashed bg-muted/20 border-border">
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full border-2 border-muted border-t-primary animate-spin" />
                          <p className="text-sm font-medium text-muted-foreground">Gemini is analyzing your photo...</p>
                        </CardContent>
                      </Card>
                    ) : analysis && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                         <Card className="border-none shadow-xl bg-muted/30 overflow-hidden">
                           <div className="bg-primary p-4 flex justify-between items-center text-white">
                              <div>
                                <p className="text-[10px] opacity-60 uppercase font-black tracking-widest leading-none">Studio Score</p>
                                <p className="text-2xl font-display font-black leading-none mt-1">{analysis.studioScore}%</p>
                              </div>
                              <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                              </div>
                           </div>
                           <CardContent className="p-4 space-y-4">
                              <div>
                                <h3 className="text-sm font-bold text-foreground">{analysis.productName}</h3>
                                <p className="text-xs text-muted-foreground">{analysis.category}</p>
                              </div>
                              
                              <div className="flex gap-2 flex-wrap">
                                {analysis.platformResizing.map(plt => (
                                  <Badge key={plt} variant="secondary" className="bg-primary/10 text-primary text-[10px] border-none">{plt}</Badge>
                                ))}
                              </div>
                           </CardContent>
                         </Card>

                         <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                              <Zap className="w-4 h-4 fill-primary" />
                              <p className="text-xs font-bold uppercase tracking-wide">Suggested Edits</p>
                            </div>
                            <ul className="space-y-2">
                              {analysis.suggestedEdits.map((edit, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                  <Check className="w-3 h-3 mt-0.5 text-primary shrink-0" />
                                  {edit}
                                </li>
                              ))}
                            </ul>
                         </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Manual Controls */}
                  <div className="space-y-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Enhance</p>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-xs font-medium text-foreground">Brightness</Label>
                          <span className="text-[10px] font-mono text-muted-foreground">{brightness}%</span>
                        </div>
                        <Slider value={[brightness]} max={200} step={1} onValueChange={(v) => setBrightness(v[0])} />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-xs font-medium text-foreground">Contrast</Label>
                          <span className="text-[10px] font-mono text-muted-foreground">{contrast}%</span>
                        </div>
                        <Slider value={[contrast]} max={200} step={1} onValueChange={(v) => setContrast(v[0])} />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-xs font-medium text-foreground">Saturation</Label>
                          <span className="text-[10px] font-mono text-muted-foreground">{saturation}%</span>
                        </div>
                        <Slider value={[saturation]} max={200} step={1} onValueChange={(v) => setSaturation(v[0])} />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-border bg-card">
                <Button onClick={handleDownload} className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white h-12 shadow-lg">
                  <Download className="w-4 h-4 mr-2" />
                  Download Assets
                </Button>
              </div>
            </aside>

            {/* Main Canvas Area */}
            <main className="flex-1 bg-background p-8 flex items-center justify-center relative overflow-hidden">
               {/* Background patterns */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                 <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
               </div>

               <div className="relative w-full h-full max-w-4xl max-h-[80vh] flex flex-col items-center justify-center group">
                  <div className="absolute top-0 left-0 flex gap-2">
                     <Badge className="bg-muted text-foreground border-none px-3 py-1 text-[10px] font-bold shadow-sm uppercase tracking-wider">Preview</Badge>
                     {isProcessing && <Badge variant="secondary" className="animate-pulse bg-primary text-white border-none flex items-center gap-1.5"><Zap className="w-3 h-3 fill-amber-500" /> Applying Studio AI...</Badge>}
                  </div>

                  <div className="relative rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-slate-950 flex items-center justify-center p-8 transition-all duration-300 transform group-hover:scale-[1.01]">
                    <img 
                      src={image} 
                      alt="Product Preview" 
                      className="max-w-full max-h-[70vh] object-contain transition-all duration-300"
                      style={{ 
                        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) drop-shadow(0 20px 30px rgba(0,0,0,0.5))` 
                      }}
                    />
                    
                    <AnimatePresence>
                      {isAnalyzing && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-background/40 backdrop-blur-[2px] flex items-center justify-center"
                        >
                           <motion.div 
                              className="h-full w-2 bg-gradient-to-b from-transparent via-primary to-transparent absolute"
                              animate={{ left: ['0%', '100%', '0%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                           />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <Button 
                      variant="outline" 
                      className="rounded-full bg-card border-border shadow-sm hover:shadow-md transition-all px-6 h-10 text-xs font-semibold text-foreground hover:bg-muted"
                      onClick={() => setIsProcessing(!isProcessing)}
                    >
                      <Sparkles className="w-4 h-4 mr-2 text-amber-500 fill-amber-500" />
                      Auto-Enhance
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-full bg-card border-border shadow-sm hover:shadow-md transition-all px-6 h-10 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      <Layers className="w-4 h-4 mr-2 text-primary" />
                      Remove Background
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-full bg-card border-border shadow-sm hover:shadow-md transition-all px-6 h-10 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      <Maximize2 className="w-4 h-4 mr-2 text-primary" />
                      Social Resize
                    </Button>
                  </div>
               </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
