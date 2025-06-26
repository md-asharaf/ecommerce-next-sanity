import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";
export const backendClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    token: "skz8wVAqtvBOPqqdLYTcpfTuSkUzLSLkxqjJUE1aEGuope1xWFRuJabM2YCpx0rk0Vhi2YWRoKtAxeBngUch0gqpkRTMkFJKowpJpjkxXy69k9DSrzpmNfmdTmE3aaVQElBZu6rtT8rEMIRNcZe0P8Op9jA2db2OWiTJN6klmXzIiuoK57eV",
});

