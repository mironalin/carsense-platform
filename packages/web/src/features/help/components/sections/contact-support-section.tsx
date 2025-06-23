import { motion } from "framer-motion";
import { Mail } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { itemVariants } from "../../utils/animation-variants";

export function ContactSupportSection() {
  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Need More Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                support@carsense.com
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                Live Chat Available
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 