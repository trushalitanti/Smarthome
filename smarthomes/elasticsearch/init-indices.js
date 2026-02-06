const axios = require('axios');

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
const ELASTICSEARCH_USERNAME = process.env.ELASTICSEARCH_USERNAME || 'elastic';
const ELASTICSEARCH_PASSWORD = process.env.ELASTICSEARCH_PASSWORD || 'Chm2z+ACc+KYzxYWRbrY';

const elasticsearchConfig = {
  auth: {
    username: ELASTICSEARCH_USERNAME,
    password: ELASTICSEARCH_PASSWORD
  },
  headers: {
    'Content-Type': 'application/json'
  }
};

async function initializeElasticsearch() {
  try {
    // Create products index
    await axios.put(
      `${ELASTICSEARCH_URL}/products`,
      {
        mappings: {
          properties: {
            id: { type: 'integer' },
            name: { type: 'text' },
            description: { type: 'text' },
            category: { type: 'keyword' },
            price: { type: 'float' },
            embedding: {
              type: 'dense_vector',
              dims: 1536,
              index: true,
              similarity: 'cosine'
            }
          }
        },
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0
        }
      },
      elasticsearchConfig
    );
    console.log('Products index created successfully');

    // Create reviews index
    await axios.put(
      `${ELASTICSEARCH_URL}/reviews`,
      {
        mappings: {
          properties: {
            productId: { type: 'integer' },
            productModelName: { type: 'text' },
            productCategory: { type: 'keyword' },
            reviewText: { type: 'text' },
            reviewRating: { type: 'integer' },
            embedding: {
              type: 'dense_vector',
              dims: 1536,
              index: true,
              similarity: 'cosine'
            }
          }
        },
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0
        }
      },
      elasticsearchConfig
    );
    console.log('Reviews index created successfully');

  } catch (error) {
    console.error('Error initializing Elasticsearch:', error.response?.data || error.message);
  }
}

initializeElasticsearch();
