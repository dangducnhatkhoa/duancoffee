# PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

plt.figure(figsize=(8, 6))
plt.scatter( X_pca[:, 0], X_pca[:, 1], c = y.astype(int), cmap="tab10", s = 10)
plt.title("PCA Visualization of MNIST")
plt.xlabel("Principal Component 1")
plt.ylabel("Principal Component 2")
plt.colorbar()
plt.show()