
library(geodata)
nga1 <- gadm("Ethiopia", level=1,  path=".")[, c("NAME_0", "NAME_1")]
nga2 <- gadm("Ethiopia", level=2,  path=".")[, c("NAME_0", "NAME_1", "NAME_2")]

maize <- crop_spam(crop="maize", var="area", path=".", africa=TRUE)[[1]]
cowpea <- crop_spam(crop="cowpea", var="area", path=".", africa=TRUE)[[1]]
cassava <- crop_spam(crop="cassava", var="area", path=".", africa=TRUE)[[1]]
rice <- crop_spam(crop="rice", var="area", path=".", africa=TRUE)[[1]]
crops <- c(maize, cowpea, cassava, rice) / 1000
names(crops) <- c("maize", "cowpea", "cassava", "rice")

e1 <- round(extract(crops, nga1, fun="sum", na.rm=TRUE))
nga1 <- cbind(nga1, e1[,-1])
e2 <- round(extract(crops, nga2, fun="sum", na.rm=TRUE))
nga2 <- cbind(nga2, e2[,-1])

writeVector(nga1, "ETA1.json", overwrite=TRUE)
writeVector(nga2, "ETA2.json", overwrite=TRUE)


