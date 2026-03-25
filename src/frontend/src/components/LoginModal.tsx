import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3X3, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
  const { login, isLoggingIn, isLoginSuccess, loginStatus } =
    useInternetIdentity();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  if (isLoginSuccess) {
    onSuccess();
  }

  const handleLogin = () => {
    login();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-md mx-4"
            data-ocid="login.modal"
          >
            <div className="card-surface rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-eg-purple/20 border border-eg-purple/40 flex items-center justify-center">
                    <Grid3X3 className="w-4 h-4 text-eg-purple" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg">
                      Echo-Grid
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Disaster Response Network
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  data-ocid="login.close_button"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <Tabs
                  value={tab}
                  onValueChange={(v) => setTab(v as "login" | "register")}
                >
                  <TabsList className="w-full mb-6 bg-muted">
                    <TabsTrigger
                      value="login"
                      className="flex-1"
                      data-ocid="login.tab"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="flex-1"
                      data-ocid="register.tab"
                    >
                      Register
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-6">
                        Sign in securely with Internet Identity — no passwords
                        required.
                      </p>
                      <Button
                        onClick={handleLogin}
                        disabled={isLoggingIn}
                        data-ocid="login.submit_button"
                        className="w-full bg-eg-orange hover:bg-eg-orange/90 text-white font-bold uppercase tracking-wider glow"
                      >
                        {isLoggingIn ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                            Connecting...
                          </>
                        ) : (
                          "Sign In with Internet Identity"
                        )}
                      </Button>
                      {loginStatus === "loginError" && (
                        <p
                          className="mt-3 text-sm text-destructive"
                          data-ocid="login.error_state"
                        >
                          Authentication failed. Please try again.
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="register" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label
                          htmlFor="reg-name"
                          className="text-xs text-muted-foreground uppercase tracking-wider"
                        >
                          Full Name
                        </Label>
                        <Input
                          id="reg-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Priya Sharma"
                          className="mt-1 bg-input border-border"
                          data-ocid="register.name.input"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="reg-phone"
                          className="text-xs text-muted-foreground uppercase tracking-wider"
                        >
                          Phone Number
                        </Label>
                        <Input
                          id="reg-phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="mt-1 bg-input border-border"
                          data-ocid="register.phone.input"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="reg-city"
                          className="text-xs text-muted-foreground uppercase tracking-wider"
                        >
                          City
                        </Label>
                        <Input
                          id="reg-city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Delhi / Noida / Gurgaon"
                          className="mt-1 bg-input border-border"
                          data-ocid="register.city.input"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Complete registration with Internet Identity to secure
                      your account.
                    </p>
                    <Button
                      onClick={handleLogin}
                      disabled={isLoggingIn}
                      data-ocid="register.submit_button"
                      className="w-full bg-eg-orange hover:bg-eg-orange/90 text-white font-bold uppercase tracking-wider glow"
                    >
                      {isLoggingIn ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
