import { auth } from ".";
import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
    plugins: [customSessionClient<typeof auth>()],
});

export { authClient };